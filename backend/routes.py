from flask import Blueprint, request, jsonify, g
from typing import Dict, Any, List
import logging
from datetime import datetime, timedelta
from functools import wraps
from prisma import Prisma
import jwt
from jwt.exceptions import InvalidTokenError
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize blueprints and database
api_bp = Blueprint('api', __name__)
db = Prisma()

# Configuration from environment
DATABASE_URL = os.getenv('DATABASE_URL')
JWT_SECRET = os.getenv('JWT_SECRET')
JWT_EXPIRE_DAYS = int(os.getenv('JWT_EXPIRE_DAYS', '7'))

# Authentication middleware
def authenticate(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return format_response(
                status='error',
                error='Missing or invalid authorization token',
                status_code=401
            )
        
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            g.user_id = payload['user_id']
        except InvalidTokenError:
            return format_response(
                status='error',
                error='Invalid token',
                status_code=401
            )
        except Exception as e:
            logging.error(f"Authentication error: {str(e)}")
            return format_response(
                status='error',
                error='Authentication failed',
                status_code=401
            )
        
        return f(*args, **kwargs)
    return wrapper

# Response formatting
def format_response(data=None, status='success', error=None, status_code=200):
    return jsonify({
        'status': status,
        'data': data,
        'error': error
    }), status_code

# Error handling decorator
def handle_errors(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            logging.error(f"API Error: {str(e)}")
            return format_response(
                status='error',
                error=str(e),
                status_code=500
            )
    return wrapper

# Connect to database before first request
@api_bp.before_app_first_request
async def connect_db():
    await db.connect(
        datasource={
            'url': DATABASE_URL
        }
    )

# Login endpoint
@api_bp.route('/login', methods=['POST'])
@handle_errors
async def login():
    """Authenticate user and return JWT token"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return format_response(
            status='error',
            error='Email and password required',
            status_code=400
        )

    try:
        user = await db.user.find_unique(
            where={'email': email},
            include={'profile': True}
        )

        if not user or not verify_password(password, user.password_hash):
            return format_response(
                status='error',
                error='Invalid credentials',
                status_code=401
            )

        token = jwt.encode(
            {
                'user_id': user.id,
                'exp': datetime.utcnow() + timedelta(days=JWT_EXPIRE_DAYS)
            },
            JWT_SECRET,
            algorithm='HS256'
        )

        return format_response(data={
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': f"{user.profile.firstName} {user.profile.lastName}"
            }
        })
    except Exception as e:
        logging.error(f"Login failed: {str(e)}")
        return format_response(
            status='error',
            error='Login failed',
            status_code=500
        )

def verify_password(plain_password, hashed_password):
    # TODO: Implement proper password verification
    # For now just do simple comparison
    return plain_password == hashed_password

# Activity Service
@api_bp.route('/activities', methods=['POST'])
@handle_errors
async def create_activity():
    """Log any activity type"""
    data = request.get_json()
    user_id = data.get('userId')
    activity_type = data.get('type')
    activity_data = data.get('data', {})

    if not user_id or not activity_type:
        return format_response(
            status='error',
            error='userId and type are required',
            status_code=400
        )

    try:
        activity = await db.activity.create({
            'data': {
                'userId': int(user_id),
                'type': activity_type.upper(),
                'data': activity_data
            }
        })
        return format_response(data={
            'id': activity.id,
            'type': activity.type,
            'createdAt': activity.createdAt.isoformat()
        }, status_code=201)
    except ValueError:
        return format_response(
            status='error',
            error='Invalid user ID',
            status_code=400
        )
    except Exception as e:
        logging.error(f"Failed to create activity: {str(e)}")
        return format_response(
            status='error',
            error='Failed to log activity',
            status_code=500
        )

@api_bp.route('/activities/<activity_id>', methods=['GET'])
@handle_errors
async def get_activity(activity_id):
    """Get activity details"""
    try:
        activity = await db.activity.find_unique(
            where={'id': int(activity_id)}
        )

        if not activity:
            return format_response(
                status='error',
                error='Activity not found',
                status_code=404
            )

        return format_response(data={
            'id': activity.id,
            'userId': activity.userId,
            'type': activity.type,
            'data': activity.data,
            'createdAt': activity.createdAt.isoformat()
        })
    except ValueError:
        return format_response(
            status='error',
            error='Invalid activity ID',
            status_code=400
        )
    except Exception as e:
        logging.error(f"Failed to fetch activity: {str(e)}")
        return format_response(
            status='error',
            error='Failed to fetch activity',
            status_code=500
        )

# Trail Service  
@api_bp.route('/trails', methods=['GET'])
@handle_errors
async def get_trails():
    """List all trails"""
    try:
        trails = await db.trail.find_many(
            orderBy={'name': 'asc'}
        )
        return format_response(data={
            'trails': [
                {
                    'id': trail.id,
                    'name': trail.name,
                    'difficulty': trail.difficulty,
                    'distance': trail.distance,
                    'elevationGain': trail.elevationGain
                }
                for trail in trails
            ]
        })
    except Exception as e:
        logging.error(f"Failed to fetch trails: {str(e)}")
        return format_response(
            status='error',
            error='Failed to fetch trails',
            status_code=500
        )

@api_bp.route('/trails/<trail_id>', methods=['GET'])
@handle_errors
async def get_trail(trail_id):
    """Get trail details"""
    try:
        trail = await db.trail.find_unique(
            where={'id': int(trail_id)},
            include={
                'features': True,
                'reviews': {
                    'take': 5,
                    'orderBy': {
                        'createdAt': 'desc'
                    }
                }
            }
        )

        if not trail:
            return format_response(
                status='error',
                error='Trail not found',
                status_code=404
            )

        return format_response(data={
            'id': trail.id,
            'name': trail.name,
            'description': trail.description,
            'difficulty': trail.difficulty,
            'distance': trail.distance,
            'elevationGain': trail.elevationGain,
            'features': [
                feature.name
                for feature in trail.features
            ],
            'recentReviews': [
                {
                    'rating': review.rating,
                    'comment': review.comment,
                    'createdAt': review.createdAt.isoformat()
                }
                for review in trail.reviews
            ]
        })
    except ValueError:
        return format_response(
            status='error',
            error='Invalid trail ID',
            status_code=400
        )
    except Exception as e:
        logging.error(f"Failed to fetch trail: {str(e)}")
        return format_response(
            status='error',
            error='Failed to fetch trail details',
            status_code=500
        )


# Profile Endpoints
# Profile Service
@api_bp.route('/profile', methods=['GET'])
@handle_errors
async def get_profile():
    """Get complete profile data"""
    user_id = request.args.get('userId')
    if not user_id:
        return format_response(
            status='error',
            error='User ID required',
            status_code=400
        )

    try:
        user = await db.user.find_unique(
            where={'id': int(user_id)},
            include={
                'profile': True,
                'activities': {
                    'where': {
                        'type': 'HIKE'
                    },
                    'orderBy': {
                        'createdAt': 'desc'
                    }
                },
                'achievements': {
                    'include': {
                        'achievement': True
                    }
                }
            }
        )

        if not user:
            return format_response(
                status='error',
                error='User not found',
                status_code=404
            )

        # Calculate stats from activities
        total_hikes = len(user.activities)
        total_distance = sum(float(a.data.get('distance', 0)) for a in user.activities)
        
        return format_response(data={
            'id': user.id,
            'email': user.email,
            'xp': user.xp,
            'level': user.level,
            'profile': {
                'firstName': user.profile.firstName if user.profile else '',
                'lastName': user.profile.lastName if user.profile else '',
                'bio': user.profile.bio if user.profile else '',
                'avatarUrl': user.profile.avatarUrl if user.profile else '/placeholder.svg',
                'location': user.profile.location if user.profile else ''
            },
            'stats': {
                'totalHikes': total_hikes,
                'totalDistance': total_distance,
                'totalElevation': 0,  # TODO: Calculate from activities
                'longestHike': 0,    # TODO: Calculate from activities
                'highestElevation': 0 # TODO: Calculate from activities
            },
            'badges': [
                {
                    'id': ua.achievement.id,
                    'name': ua.achievement.name,
                    'description': ua.achievement.description,
                    'unlocked': True,
                    'unlockedAt': ua.unlockedAt
                }
                for ua in user.achievements
            ],
            'devices': []  # TODO: Implement device tracking
        })
    except ValueError:
        return format_response(
            status='error',
            error='Invalid user ID',
            status_code=400
        )
    except Exception as e:
        logging.error(f"Failed to fetch profile: {str(e)}")
        return format_response(
            status='error',
            error='Failed to fetch profile data',
            status_code=500
        )

@api_bp.route('/profile/achievements', methods=['GET'])
@handle_errors
async def get_achievements():
    """Get unlocked badges"""
    user_id = request.args.get('userId')
    if not user_id:
        return format_response(
            status='error',
            error='User ID required',
            status_code=400
        )

    achievements = await db.userachievement.find_many(
        where={'userId': int(user_id)},
        include={'achievement': True}
    )

    return format_response(data=[
        {
            'id': ua.achievement.id,
            'name': ua.achievement.name,
            'description': ua.achievement.description,
            'xpValue': ua.achievement.xpValue,
            'unlockedAt': ua.unlockedAt.isoformat()
        }
        for ua in achievements
    ])

# Content Service
@api_bp.route('/posts', methods=['GET'])
@handle_errors
async def get_posts():
    """Get adventure posts"""
    try:
        posts = await db.adventurepost.find_many(
            orderBy={'createdAt': 'desc'},
            include={
                'user': {
                    'include': {
                        'profile': True
                    }
                },
                'images': True
            }
        )
        
        return format_response(data=[
            {
                'id': post.id,
                'title': post.title,
                'description': post.description,
                'activityType': post.activityType,
                'location': post.location,
                'stats': post.stats,
                'likes': post.likes,
                'comments': post.comments,
                'createdAt': post.createdAt.isoformat(),
                'user': {
                    'id': post.user.id,
                    'name': f"{post.user.profile.firstName} {post.user.profile.lastName}",
                    'avatar': post.user.profile.avatarUrl
                },
                'images': [
                    image.url
                    for image in post.images
                ]
            }
            for post in posts
        ])
    except Exception as e:
        logging.error(f"Failed to fetch posts: {str(e)}")
        return format_response(
            status='error',
            error='Failed to fetch posts',
            status_code=500
        )

@api_bp.route('/upload', methods=['POST'])
@handle_errors
async def upload_file():
    """Handle file uploads"""
    if 'file' not in request.files:
        return format_response(
            status='error',
            error='No file uploaded',
            status_code=400
        )

    file = request.files['file']
    if file.filename == '':
        return format_response(
            status='error',
            error='No selected file',
            status_code=400
        )

    try:
        # TODO: Implement actual file upload to S3 or storage service
        # For now just return a mock URL
        filename = f"uploads/{datetime.now().timestamp()}_{file.filename}"
        return format_response(data={
            'url': f"/{filename}"
        })
    except Exception as e:
        logging.error(f"Failed to upload file: {str(e)}")
        return format_response(
            status='error',
            error='Failed to upload file',
            status_code=500
        )

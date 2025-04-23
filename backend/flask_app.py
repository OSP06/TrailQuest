from flask import Flask, jsonify
from flask_cors import CORS
import logging
import os
from typing import Optional

def create_app(test_config: Optional[dict] = None) -> Flask:
    """Application factory for Flask app"""
    app = Flask(__name__)
    
    # Configuration
    app.config.from_mapping(
        SECRET_KEY=os.getenv('JWT_SECRET', 'dev'),
        DATABASE_URL=os.getenv('DATABASE_URL'),
        JWT_EXPIRE_DAYS=int(os.getenv('JWT_EXPIRE_DAYS', '7'))
    )
    
    if test_config:
        app.config.update(test_config)
    
    # Initialize extensions
    CORS(app, resources={
        r"/api/*": {"origins": "*"}
    })
    
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    
    # Register blueprints
    from routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return jsonify({'status': 'healthy'}), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)

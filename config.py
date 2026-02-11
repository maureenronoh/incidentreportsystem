"""
Configuration settings for iReporter application
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Config:
    """Base configuration"""
    
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = False
    TESTING = False
    
    # JWT settings
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours
    
    # MongoDB settings
    MONGODB_HOST = os.getenv('MONGODB_HOST', 'localhost')
    MONGODB_PORT = int(os.getenv('MONGODB_PORT', 27017))
    MONGODB_DB = os.getenv('MONGODB_DB', 'ireporter')
    MONGODB_URI = f"mongodb://{MONGODB_HOST}:{MONGODB_PORT}/{MONGODB_DB}"
    
    # CORS settings
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')
    
    # Application settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov'}


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False


class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    MONGODB_DB = 'ireporter_test'
    MONGODB_URI = f"mongodb://{Config.MONGODB_HOST}:{Config.MONGODB_PORT}/ireporter_test"


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    
    # Override with environment variables in production
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    MONGODB_URI = os.getenv('MONGODB_URI')
    
    # Ensure required settings are set
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY must be set in production")
    if not JWT_SECRET_KEY:
        raise ValueError("JWT_SECRET_KEY must be set in production")
    if not MONGODB_URI:
        raise ValueError("MONGODB_URI must be set in production")


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}


def get_config(env=None):
    """Get configuration based on environment"""
    if env is None:
        env = os.getenv('FLASK_ENV', 'development')
    return config.get(env, config['default'])

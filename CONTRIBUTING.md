# Contributing to iReporter

Thank you for your interest in contributing to iReporter! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Python 3.7+
- Node.js 14+
- MongoDB 4.0+
- Git

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/ireporter.git
   cd ireporter
   ```

2. **Set up the backend**
   ```bash
   pip install -r requirements.txt
   python run_mongodb.py
   ```

3. **Set up the frontend**
   ```bash
   cd ireporter-frontend
   npm install
   npm start
   ```

## 🎯 How to Contribute

### Reporting Bugs
- Use the GitHub issue tracker
- Include detailed steps to reproduce
- Provide system information (OS, Python version, etc.)
- Include error messages and logs

### Suggesting Features
- Open an issue with the "enhancement" label
- Describe the feature and its benefits
- Provide use cases and examples
- Consider implementation complexity

### Code Contributions

#### Branch Naming
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

#### Commit Messages
- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove)
- Keep first line under 50 characters
- Include detailed description if needed

Example:
```
Add anonymous incident linking functionality

- Automatically link anonymous reports to user accounts
- Match by email address during registration/login
- Show notification when incidents are linked
- Update database schema to support linking
```

## 🧪 Testing

### Backend Testing
```bash
# Run API tests
python test_mongodb_api.py

# Test anonymous reporting
python test_anonymous_reporting.py

# Check database functionality
python check_incidents.py
```

### Frontend Testing
```bash
cd ireporter-frontend
npm test
```

### Manual Testing
- Test all user flows (registration, login, reporting)
- Verify mobile responsiveness
- Test PWA installation
- Check admin functionality

## 📝 Code Style

### Python (Backend)
- Follow PEP 8 style guide
- Use meaningful variable names
- Add docstrings to functions
- Handle errors gracefully
- Use type hints where appropriate

### JavaScript/React (Frontend)
- Use functional components with hooks
- Follow React best practices
- Use meaningful component names
- Add PropTypes or TypeScript
- Keep components focused and reusable

### General Guidelines
- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Use consistent naming conventions
- Remove unused code and imports

## 🏗️ Architecture Guidelines

### Backend Structure
```
├── run_mongodb.py          # Main Flask application
├── restapi/
│   ├── controllers/        # Business logic
│   ├── models/            # Data models
│   ├── views/             # API endpoints
│   └── utilities/         # Helper functions
```

### Frontend Structure
```
├── src/
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── context/          # React context
│   └── utils/            # Utility functions
```

### Database Design
- Use MongoDB collections: `users`, `incidents`
- Include proper indexing for performance
- Maintain data consistency
- Handle edge cases (null values, etc.)

## 🔒 Security Considerations

### Backend Security
- Validate all input data
- Use parameterized queries
- Implement proper authentication
- Handle sensitive data carefully
- Add rate limiting for APIs

### Frontend Security
- Sanitize user input
- Use HTTPS in production
- Implement proper CORS
- Avoid storing sensitive data in localStorage
- Validate data from APIs

## 📚 Documentation

### Code Documentation
- Add docstrings to Python functions
- Comment complex algorithms
- Document API endpoints
- Include usage examples

### User Documentation
- Update README.md for new features
- Add setup instructions
- Include troubleshooting guides
- Provide usage examples

## 🚀 Deployment

### Development
- Use development servers (Flask dev server, React dev server)
- Enable debug mode for detailed error messages
- Use local MongoDB instance

### Production
- Use production WSGI server (Gunicorn, uWSGI)
- Build React app for production
- Use MongoDB Atlas or production MongoDB
- Enable HTTPS
- Set up proper logging

## 📋 Pull Request Process

1. **Create feature branch** from main
2. **Make changes** following code style guidelines
3. **Add tests** for new functionality
4. **Update documentation** as needed
5. **Test thoroughly** on different devices/browsers
6. **Submit pull request** with detailed description

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Backend tests pass
- [ ] Frontend tests pass
- [ ] Manual testing completed
- [ ] Mobile testing completed

## Screenshots
Include screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🤝 Community Guidelines

### Be Respectful
- Use inclusive language
- Be constructive in feedback
- Help newcomers
- Respect different perspectives

### Communication
- Use GitHub issues for bug reports and feature requests
- Join discussions in pull requests
- Ask questions if unclear
- Provide helpful feedback

## 📞 Getting Help

- **Documentation**: Check the `/docs` folder
- **Issues**: Search existing GitHub issues
- **Questions**: Open a GitHub discussion
- **API Help**: Visit http://localhost:5000/api/help

Thank you for contributing to iReporter! 🎉
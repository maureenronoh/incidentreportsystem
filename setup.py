"""
iReporter - Incident Reporting System
Setup configuration for Python package
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="ireporter",
    version="1.0.0",
    author="Maureen Ronoh",
    author_email="your.email@example.com",
    description="A modern incident reporting system for corruption and public service issues",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/maureenronoh/incidentreportsystem",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries :: Application Frameworks",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Framework :: Flask",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
    install_requires=[
        "Flask>=2.0.0",
        "Flask-CORS>=3.0.0",
        "Flask-JWT-Extended>=4.0.0",
        "pymongo>=4.0.0",
        "bcrypt>=3.2.0",
        "python-dotenv>=0.19.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-cov>=3.0.0",
            "black>=22.0.0",
            "flake8>=4.0.0",
            "mypy>=0.950",
        ],
    },
    entry_points={
        "console_scripts": [
            "ireporter=backend_complete_simple:main",
        ],
    },
    project_urls={
        "Bug Reports": "https://github.com/maureenronoh/incidentreportsystem/issues",
        "Source": "https://github.com/maureenronoh/incidentreportsystem",
        "Documentation": "https://github.com/maureenronoh/incidentreportsystem/tree/main/docs",
    },
)

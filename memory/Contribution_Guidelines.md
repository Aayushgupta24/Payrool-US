# Contribution Guidelines

## Overview

This document provides guidelines for contributing to the US Payroll application. Following these guidelines helps maintain code quality, consistency, and makes the development process smoother for everyone involved.

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn package manager
- Git

### Setting Up the Development Environment

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Payrool-US
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the necessary environment variables (see `Project_Setup.md` for details).

4. Start the development server:
   ```bash
   npm run dev
   ```

## Branching Strategy

We follow a simplified Git flow branching strategy:

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/<feature-name>`: For new features
- `bugfix/<bug-description>`: For bug fixes
- `hotfix/<hotfix-description>`: For urgent production fixes

### Creating a New Feature

1. Create a new branch from `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/your-feature-name
   ```

2. Implement your changes, following the coding standards.

3. Commit your changes with meaningful commit messages:
   ```bash
   git commit -m "feat: add employee onboarding wizard"
   ```

4. Push your branch and create a pull request to `develop`.

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that don't affect code functionality (formatting, etc.)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```
feat(auth): add email verification step

Add email verification step to the registration process to improve security.

Closes #123
```

```
fix: correct calculation of overtime hours

The overtime calculation was incorrectly using 35 hours as the threshold
instead of 40 hours.
```

## Pull Request Process

1. Ensure your code follows the coding standards.
2. Update documentation if necessary.
3. Include tests for new functionality.
4. Make sure all tests pass.
5. Request a review from at least one team member.
6. Address any feedback from the code review.
7. Once approved, the PR will be merged by a maintainer.

## Coding Standards

### General Guidelines

- Write clean, readable, and maintainable code
- Follow the DRY (Don't Repeat Yourself) principle
- Keep functions and components small and focused
- Use meaningful variable and function names
- Add comments for complex logic, but prefer self-documenting code

### TypeScript Guidelines

- Use TypeScript for type safety
- Define interfaces for props, state, and API responses
- Use type inference where appropriate
- Avoid using `any` type when possible
- Use optional chaining and nullish coalescing operators

### React Guidelines

- Use functional components with hooks
- Keep components focused on a single responsibility
- Use React Context for global state management
- Use custom hooks to encapsulate reusable logic
- Follow the React component lifecycle appropriately

### CSS/Styling Guidelines

- Use Tailwind CSS utility classes for most styling needs
- Create custom CSS only when necessary
- Follow the project's color palette and design system
- Ensure responsive design works on all target devices
- Consider accessibility in your styling choices

## Testing Guidelines

### Unit Testing

- Write unit tests for utility functions and hooks
- Use Jest for testing framework
- Mock external dependencies

### Component Testing

- Test component rendering and behavior
- Verify component props and state changes
- Test user interactions

### Integration Testing

- Test interactions between components
- Verify data flow through the application
- Test API integrations with mock servers

## Documentation Guidelines

### Code Documentation

- Add JSDoc comments for functions and components
- Document complex algorithms and business logic
- Keep comments up-to-date with code changes

### Project Documentation

- Update README.md with new features or changes
- Document API changes in the API reference
- Update setup instructions if dependencies change

## Performance Considerations

- Optimize component rendering with React.memo, useMemo, and useCallback
- Minimize unnecessary re-renders
- Use pagination or virtualization for large lists
- Optimize images and assets
- Consider code splitting for large bundles

## Accessibility Guidelines

- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure sufficient color contrast
- Support keyboard navigation
- Test with screen readers

## Security Best Practices

- Validate all user inputs
- Sanitize data before rendering to prevent XSS
- Use environment variables for sensitive information
- Implement proper authentication and authorization
- Keep dependencies updated to avoid vulnerabilities

## Release Process

1. Merge feature branches into `develop`
2. Test the `develop` branch thoroughly
3. Create a release branch from `develop`
4. Perform final testing on the release branch
5. Merge the release branch into `main`
6. Tag the release with a version number
7. Deploy to production

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- MAJOR version for incompatible API changes
- MINOR version for backward-compatible functionality additions
- PATCH version for backward-compatible bug fixes

## Getting Help

If you need help or have questions:

- Check the existing documentation
- Ask in the project's communication channels
- Reach out to the project maintainers

## Code of Conduct

- Be respectful and inclusive
- Value diverse perspectives
- Focus on constructive feedback
- Help others learn and grow
- Prioritize the project's success over individual preferences

By following these guidelines, we can maintain a high-quality codebase and a productive development environment.

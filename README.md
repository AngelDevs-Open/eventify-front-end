# EventifyFrontEnd - Event Management Platform

[![Angular Version](https://img.shields.io/badge/Angular-19.2.11-%23DD0031)](https://angular.io/)


## Summary

EventifyFrontEnd is an Angular application for comprehensive event management, developed with Angular CLI 19.2.11. Provides modern tools for creating, organizing, and managing events of any scale.

## Key Features
- **Complete event lifecycle management** from creation to execution
- **Admin dashboard** with real-time metrics
- **Integrated booking and ticketing system**
- **Multilingual support** with i18n implementation
- **Responsive design** for mobile devices
- **API integration** for complementary services

## System Requirements
- Node.js v18+
- npm v9+ or yarn v1.22+
- Angular CLI 19.2.11

## Initial Setup

```bash
# Clone repository
git clone https://github.com/AngelDevs-Open/eventify-front-end.git

# Install dependencies
npm install

# Set up environment variables
cp src/environments/environment.example.ts src/environments/environment.ts
```

## Development Server

```bash
ng serve
```
Access the application at: [http://localhost:4200](http://localhost:4200)

## Production Build

```bash
ng build --configuration production
```
The build artifacts will be stored in the `dist/` directory.

## Testing

**Unit Tests:**
```bash
ng test
```

**End-to-End Tests:**
```bash
ng e2e
```
_Note: Angular CLI doesn't include a default e2e testing framework. You need to choose and configure one separately._

## Project Structure
```
eventify-front-end/
├── src/                   # Core application source code
│   ├── app/               # Application components
│   ├── assets/            # Static assets
│   ├── environments/      # Environment configurations
│   └── styles/            # Global style sheets
├── server/                # Local development API
├── .editorconfig          # Code style configuration
├── angular.json           # Angular CLI configuration
└── tsconfig.json          # TypeScript configuration
```

## Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` file for more information.

___
## **Authors**

This project is maintained by the AngelDevs-Web team and contributors:

|            **Alumno**            | **Codigo** |
|:--------------------------------:|:----------:|
| Fabrizio Alexander Cutiri Agüero | U201914181 |
| Omar Christian Berrocal Ramirez  | U20201B529 |
|  Deybbi Anderson Crisanto Calle  | U202120569 |
|   July Zelmira Paico Calderon    | U20211D760 |
|     Jean Pierr Aldave Aldave     | U202120005 |

---

**Built with ❤️ by AngelDevs-Web Team**

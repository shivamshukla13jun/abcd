import fs from "fs/promises";
import path from "path";
import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const rootRouter = Router();
const microservicesDir = path.join(__dirname, "../microservices");

// Helper function to check file existence
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Phase 2: Load routes and generate Swagger documentation
async function loadRoutes() {
  const swaggerSpec: swaggerJSDoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Microservices API",
        version: "1.0.0",
      },
      paths: {},
      components: {
        schemas: {},
      },
      tags: [],
    },
    apis: [], // We'll populate paths manually
  };

  const serviceDirs = await fs.readdir(microservicesDir);

  for (const serviceDir of serviceDirs) {
    try {
      const servicePath = path.join(microservicesDir, serviceDir);
      const configFilePath = path.join(servicePath, "config.json");
      let routeFilePath = path.join(servicePath, "route.js");

      if (!(await fileExists(routeFilePath))) {
        routeFilePath = path.join(servicePath, "route.ts");
      }

      if ((await fileExists(configFilePath)) && (await fileExists(routeFilePath))) {
        const config = await import(configFilePath);
        const routerModule = await import(routeFilePath);

        if (routerModule.default) {
          rootRouter.use(config.baseUrl || "/", routerModule.default);
        }

        // Merge Swagger documentation
        if (config.swagger) {
          const baseUrl = config.baseUrl || "/";
          
          // Merge paths
          for (const [pathKey, pathValue] of Object.entries(config.swagger.paths || {})) {
            const fullPath = path.join(baseUrl, pathKey).replace(/\\/g, "/");
            if (swaggerSpec.definition) {
              swaggerSpec.definition.paths[fullPath] = pathValue;
            }
          }

          // Merge schemas
          Object.assign(
            swaggerSpec.definition?.components?.schemas || {},
            config.swagger.components?.schemas || {}
          );

          // Merge tags
          if (config.swagger.tags) {
            if (swaggerSpec.definition) {
              swaggerSpec.definition.tags = [
              ...(swaggerSpec.definition?.tags || []),
              ];
            }
            
          }
        }
      }
    } catch (error: any) {
      console.error(`Error loading ${serviceDir}:`, error.message);
    }
  }

  // Generate Swagger documentation
  const swaggerDocs = swaggerJSDoc(swaggerSpec);
  rootRouter.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

// Initialize application (existing structure remains)
async function initializeApp() {
  try {
    await loadRoutes();
    console.log("Application initialized with Swagger documentation");
  } catch (error) {
    console.error("Initialization failed:", error);
  }
}

initializeApp();

export default rootRouter;
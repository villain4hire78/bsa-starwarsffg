import { StarWarsFFG } from './starwarsffg.js';

console.log("BSA-StarWarsFFG | Module loading...");

// Register when BSI is ready
Hooks.on("beavers-system-interface.init", async function() {
  console.log("BSA-StarWarsFFG | BSI init hook triggered");
  console.log("BSA-StarWarsFFG | Game system:", game.system.id);
  
  if (game.system.id === "starwarsffg") {
    console.log("BSA-StarWarsFFG | Registering Star Wars FFG system adapter");
    try {
      beaversSystemInterface.register(new StarWarsFFG());
      console.log("BSA-StarWarsFFG | Successfully registered");
    } catch (error) {
      console.error("BSA-StarWarsFFG | Registration failed:", error);
    }
  } else {
    console.log("BSA-StarWarsFFG | Wrong system, not registering");
  }
});

// Also try registering on ready hook as backup
Hooks.on("ready", async function() {
  console.log("BSA-StarWarsFFG | Ready hook triggered");
  
  if (game.system.id === "starwarsffg" && typeof beaversSystemInterface !== "undefined") {
    console.log("BSA-StarWarsFFG | BSI available, checking if already registered");
    
    // Check if we're already registered
    if (!beaversSystemInterface.system || beaversSystemInterface.system.id !== "starwarsffg") {
      console.log("BSA-StarWarsFFG | Not registered, attempting registration");
      try {
        beaversSystemInterface.register(new StarWarsFFG());
        console.log("BSA-StarWarsFFG | Successfully registered on ready");
      } catch (error) {
        console.error("BSA-StarWarsFFG | Registration failed on ready:", error);
      }
    } else {
      console.log("BSA-StarWarsFFG | Already registered");
    }
  }
});

console.log("BSA-StarWarsFFG | Hooks registered");

import { StarWarsFFG } from './starwarsffg.js';

Hooks.on("beavers-system-interface.init", async function() {
  console.log("BSA-StarWarsFFG | Registering Star Wars FFG system adapter");
  beaversSystemInterface.register(new StarWarsFFG());
});

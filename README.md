# BSA Star Wars FFG

Beaver's System Adapter for Star Wars FFG - A Foundry VTT Module

## Description

This module provides system-specific implementation for the Star Wars FFG system to work with [Beaver's System Interface](https://github.com/AngryBeaver/beavers-system-interface). It enables other BSI-compatible modules (like Beaver's Crafting) to work seamlessly with the Star Wars FFG system.

## Installation

### Method 1: Module Browser (Recommended when published)
1. In Foundry VTT, go to the "Add-on Modules" tab
2. Click "Install Module"
3. Search for "BSA Star Wars FFG"
4. Click Install

### Method 2: Manual Installation
1. Download the latest release from [GitHub Releases](https://github.com/villain4hire78/bsa-starwarsffg/releases)
2. Extract the zip file to your Foundry `Data/modules` directory
3. Restart Foundry VTT
4. Enable the module in your world

### Method 3: Direct Manifest URL
Use this manifest URL in Foundry's module installer:

https://github.com/villain4hire78/bsa-starwarsffg/releases/latest/download/module.json

## Dependencies

This module requires:
- [Beaver's System Interface](https://github.com/AngryBeaver/beavers-system-interface) v2.1.1+
- [Star Wars FFG System](https://github.com/StarWarsFoundryVTT/StarWarsFFG) v2.1.0+

## Features

- **Skill Rolling**: Integrates with FFG's narrative dice system
- **Currency Management**: Handles credits for crafting and transactions
- **Item Management**: Supports FFG item types with proper quantity tracking
- **Rest Mechanics**: Adapted for Star Wars strain/wound system
- **UI Integration**: Custom dialogs styled for the FFG system

## Compatible Modules

This adapter enables the following BSI-compatible modules to work with Star Wars FFG:
- [Beaver's Crafting](https://github.com/AngryBeaver/beavers-crafting)
- Other BSI-compatible modules

## Usage

Once installed and enabled, this module works automatically in the background. Other BSI-compatible modules will detect and use this adapter when running in a Star Wars FFG world.

## Support

For bug reports and feature requests, please use the [GitHub Issues](https://github.com/villain4hire78/bsa-starwarsffg/issues) page.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

- Created for the [Beaver's System Interface](https://github.com/AngryBeaver/beavers-system-interface) by AngryBeaver
- Compatible with [Star Wars FFG System](https://github.com/StarWarsFoundryVTT/StarWarsFFG)
- Fantasy Flight Games for the original Star Wars RPG system

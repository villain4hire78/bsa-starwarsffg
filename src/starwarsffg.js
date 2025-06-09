export class StarWarsFFG {
  
  get version() {
    return "2";
  }

  get id() {
    return "starwarsffg";
  }

  // ===============================================
  // Actor Management
  // ===============================================

  actorRollSkill(actor, skillId, options = {}) {
    const skill = actor.system.skills[skillId];
    if (!skill) {
      ui.notifications.error(`Skill ${skillId} not found on actor ${actor.name}`);
      return null;
    }

    // Star Wars FFG uses custom dice system
    // Build dice pool from characteristic + skill ranks
    const characteristic = actor.system.characteristics[skill.characteristic];
    const skillRank = skill.rank || 0;
    const charValue = characteristic?.value || 0;

    // Create dice pool for FFG system
    const dicePool = {
      ability: Math.max(charValue, skillRank),
      proficiency: Math.min(charValue, skillRank),
      boost: options.boost || 0,
      setback: options.setback || 0,
      challenge: options.challenge || 0,
      difficulty: options.difficulty || 0
    };

    // Use the FFG system's dice roller
    return game.ffg?.DiceHelpers?.rollSkillDirect(
      dicePool,
      actor,
      {
        skill: skillId,
        ...options
      }
    );
  }

  actorCurrencies(actor) {
    const credits = actor.system.stats?.credits?.value || 0;
    return [
      {
        name: "Credits",
        value: credits,
        id: "credits"
      }
    ];
  }

  actorSpendCurrency(actor, costs) {
    const updates = {};
    
    for (const cost of costs) {
      if (cost.id === "credits") {
        const currentCredits = actor.system.stats?.credits?.value || 0;
        const newCredits = currentCredits - cost.value;
        
        if (newCredits < 0) {
          ui.notifications.error(`${actor.name} doesn't have enough credits (needs ${cost.value}, has ${currentCredits})`);
          return false;
        }
        
        updates["system.stats.credits.value"] = newCredits;
      }
    }
    
    if (Object.keys(updates).length > 0) {
      actor.update(updates);
      return true;
    }
    
    return false;
  }

  actorShortRest(actor, options = {}) {
    // Star Wars FFG doesn't have traditional short rests
    // Instead, characters can spend strain to recover
    ui.notifications.info(`${actor.name} takes a moment to catch their breath`);
    
    // Optionally recover some strain
    if (options.recoverStrain) {
      const currentStrain = actor.system.stats?.strain?.value || 0;
      const strainRecovery = Math.min(currentStrain, 2); // Recover 2 strain
      
      if (strainRecovery > 0) {
        actor.update({
          "system.stats.strain.value": currentStrain - strainRecovery
        });
        ui.notifications.info(`${actor.name} recovers ${strainRecovery} strain`);
      }
    }
    
    return true;
  }

  actorLongRest(actor, options = {}) {
    // In Star Wars FFG, this would be similar to extended rest
    const updates = {};
    
    // Recover all strain
    const currentStrain = actor.system.stats?.strain?.value || 0;
    if (currentStrain > 0) {
      updates["system.stats.strain.value"] = 0;
    }
    
    // Recover some wounds (GM discretion)
    const currentWounds = actor.system.stats?.wounds?.value || 0;
    const woundRecovery = Math.min(currentWounds, 1);
    if (woundRecovery > 0) {
      updates["system.stats.wounds.value"] = currentWounds - woundRecovery;
    }
    
    if (Object.keys(updates).length > 0) {
      actor.update(updates);
      ui.notifications.info(`${actor.name} recovers from extended rest`);
    }
    
    return true;
  }

  // ===============================================
  // Item Management
  // ===============================================

  itemPile(item) {
    // Star Wars FFG items that can be stacked
    const stackableTypes = ['consumable', 'gear', 'weapon', 'armour'];
    return stackableTypes.includes(item.type);
  }

  itemQuantity(item) {
    return item.system.quantity?.value || 1;
  }

  itemSetQuantity(item, quantity) {
    return item.update({
      "system.quantity.value": quantity
    });
  }

  itemPrice(item) {
    const price = item.system.price?.value || 0;
    const rarity = item.system.rarity?.value || 0;
    
    return [
      {
        name: "Credits",
        value: price,
        id: "credits"
      }
    ];
  }

  itemIdentify(item, actor = null) {
    // Star Wars FFG doesn't typically have identification mechanics
    // Items are generally known unless they're mysterious artifacts
    if (item.system.identified === false) {
      item.update({"system.identified": true});
      ui.notifications.info(`${item.name} has been identified`);
      return true;
    }
    return false;
  }

  // ===============================================
  // UI and Dialogs
  // ===============================================

  async uiDialogSelect(data) {
    return new Promise((resolve) => {
      const choices = data.choices.map((choice, index) => {
        return `
          <div class="ffg-choice" style="display: flex; align-items: center; margin: 5px 0; padding: 5px; border: 1px solid #ccc; cursor: pointer;" data-index="${index}">
            ${choice.img ? `<img src="${choice.img}" style="width: 32px; height: 32px; margin-right: 10px;">` : ''}
            <span>${choice.text}</span>
          </div>
        `;
      }).join('');

      const content = `
        <div class="ffg-selection-dialog">
          ${data.text || 'Select an option:'}
          <div class="choices-container" style="max-height: 400px; overflow-y: auto; margin-top: 10px;">
            ${choices}
          </div>
        </div>
      `;

      const dialog = new Dialog({
        title: data.title || "Select Option",
        content: content,
        buttons: {
          cancel: {
            label: "Cancel",
            callback: () => resolve(null)
          }
        },
        render: (html) => {
          html.find('.ffg-choice').on('click', function() {
            const index = parseInt($(this).data('index'));
            resolve(data.choices[index]);
            dialog.close();
          });
        },
        close: () => resolve(null)
      });

      dialog.render(true);
    });
  }

  async uiDialogInput(data) {
    return new Promise((resolve) => {
      const dialog = new Dialog({
        title: data.title || "Input Required",
        content: `
          <div class="ffg-input-dialog">
            <p>${data.text || 'Enter value:'}</p>
            <input type="text" id="user-input" style="width: 100%; margin-top: 10px;" 
                   placeholder="${data.placeholder || ''}" 
                   value="${data.default || ''}">
          </div>
        `,
        buttons: {
          ok: {
            label: "OK",
            callback: (html) => {
              const value = html.find('#user-input').val();
              resolve(value);
            }
          },
          cancel: {
            label: "Cancel",
            callback: () => resolve(null)
          }
        },
        default: "ok",
        render: (html) => {
          html.find('#user-input').focus();
          html.find('#user-input').on('keypress', function(e) {
            if (e.which === 13) { // Enter key
              const value = $(this).val();
              resolve(value);
              dialog.close();
            }
          });
        },
        close: () => resolve(null)
      });

      dialog.render(true);
    });
  }

  async uiSelectItemsFrom(items, data = {}) {
    return new Promise((resolve) => {
      const itemChoices = items.map((item, index) => {
        const quantity = this.itemQuantity(item);
        const price = this.itemPrice(item);
        const priceText = price.length > 0 ? ` (${price[0].value} ${price[0].name})` : '';
        
        return `
          <div class="ffg-item-choice" style="display: flex; align-items: center; margin: 5px 0; padding: 5px; border: 1px solid #ccc;" data-index="${index}">
            <input type="checkbox" class="item-checkbox" style="margin-right: 10px;">
            <img src="${item.img}" style="width: 32px; height: 32px; margin-right: 10px;">
            <div>
              <div><strong>${item.name}</strong>${priceText}</div>
              <div><small>Quantity: ${quantity}</small></div>
            </div>
          </div>
        `;
      }).join('');

      const dialog = new Dialog({
        title: data.title || "Select Items",
        content: `
          <div class="ffg-item-selection">
            <p>${data.text || 'Select items:'}</p>
            <div class="items-container" style="max-height: 400px; overflow-y: auto; margin-top: 10px;">
              ${itemChoices}
            </div>
          </div>
        `,
        buttons: {
          ok: {
            label: "Select",
            callback: (html) => {
              const selected = [];
              html.find('.item-checkbox:checked').each(function() {
                const index = parseInt($(this).closest('.ffg-item-choice').data('index'));
                selected.push(items[index]);
              });
              resolve(selected);
            }
          },
          cancel: {
            label: "Cancel",
            callback: () => resolve([])
          }
        },
        default: "ok",
        close: () => resolve([])
      });

      dialog.render(true);
    });
  }

  // ===============================================
  // System Specific Properties
  // ===============================================

  get configSkills() {
    // Return the Star Wars FFG skills configuration
    return CONFIG.FFG?.skills || {};
  }

  get configCurrencies() {
    return [
      {
        name: "Credits",
        id: "credits",
        conversion: 1
      }
    ];
  }

  get configCanRollAbility() {
    return true; // Star Wars FFG supports ability/characteristic rolls
  }

  get configRollAbilities() {
    // Star Wars FFG characteristics
    return CONFIG.FFG?.characteristics || {
      "Brawn": "br",
      "Agility": "ag", 
      "Intellect": "int",
      "Cunning": "cun",
      "Willpower": "wil",
      "Presence": "pr"
    };
  }

  get configDamageTypes() {
    // Star Wars FFG doesn't use traditional damage types
    return {};
  }

  // ===============================================
  // Utility Methods
  // ===============================================

  getActorSkills(actor) {
    return actor.system.skills || {};
  }

  getActorAbilities(actor) {
    return actor.system.characteristics || {};
  }

  isActorCharacter(actor) {
    return actor.type === "character";
  }

  isActorNpc(actor) {
    return actor.type === "minion" || actor.type === "rival" || actor.type === "nemesis";
  }

  async rollAbility(actor, abilityId, options = {}) {
    const characteristic = actor.system.characteristics[abilityId];
    if (!characteristic) {
      ui.notifications.error(`Characteristic ${abilityId} not found on actor ${actor.name}`);
      return null;
    }

    // Create a simple dice pool for characteristic check
    const dicePool = {
      ability: characteristic.value || 0,
      proficiency: 0,
      boost: options.boost || 0,
      setback: options.setback || 0,
      challenge: options.challenge || 0,
      difficulty: options.difficulty || 2 // Default difficulty
    };

    return game.ffg?.DiceHelpers?.rollSkillDirect(
      dicePool,
      actor,
      {
        characteristic: abilityId,
        ...options
      }
    );
  }
}

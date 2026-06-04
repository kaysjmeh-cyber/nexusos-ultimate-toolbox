import type { CommandDefinition } from '@nexus-types/command-palette';
import { eventBus } from '@core/bus/event-bus';

/**
 * Registre de la command palette (Ctrl+K).
 * Les commandes sont déclaratives ; exécution branchée plus tard.
 */
export class CommandRegistry {
  private commands = new Map<string, CommandDefinition>();

  register(command: CommandDefinition): void {
    this.commands.set(command.id, command);
  }

  registerMany(commands: CommandDefinition[]): void {
    commands.forEach((c) => this.register(c));
  }

  getAll(): CommandDefinition[] {
    return [...this.commands.values()];
  }

  filter(query: string): CommandDefinition[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAll();
    return this.getAll().filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.toLowerCase().includes(q)),
    );
  }

  async execute(commandId: string): Promise<void> {
    const cmd = this.commands.get(commandId);
    if (!cmd) return;
    eventBus.emit('command:execute', { commandId });
    await cmd.execute?.();
  }
}

export const commandRegistry = new CommandRegistry();

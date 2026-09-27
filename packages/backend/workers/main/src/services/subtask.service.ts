import { HttpNotFoundException } from "@kanban/base-lib";
import { TaskRepository } from "@/repositories/task.repository";
import { SubtaskRepository } from "@/repositories/subtask.repository";

export class SubtaskService {
  constructor(
    private readonly tasks: TaskRepository,
    private readonly subtasks: SubtaskRepository
  ) {}

  async createSubtask(input: { description: string; taskId: string }, ownerId: string) {
    if (!(await this.tasks.findOneByIdAndOwner(input.taskId, ownerId)))
      throw new HttpNotFoundException({ errorCode: "TaskNotFound" });
    return { createdSubtask: await this.subtasks.create(input) };
  }

  async updateSubtask(
    input: { subtaskId: string; description?: string; completed?: boolean },
    ownerId: string
  ) {
    if (!(await this.subtasks.findOneByIdAndOwner(input.subtaskId, ownerId)))
      throw new HttpNotFoundException({ errorCode: "SubtaskNotFound" });
    const updatedSubtask = await this.subtasks.updateByIdAndOwner(input.subtaskId, ownerId, {
      description: input.description,
      completed: input.completed
    });
    if (!updatedSubtask) throw new HttpNotFoundException({ errorCode: "SubtaskNotFound" });
    return { updatedSubtask };
  }

  async deleteSubtask(subtaskId: string, ownerId: string) {
    if (!(await this.subtasks.findOneByIdAndOwner(subtaskId, ownerId)))
      throw new HttpNotFoundException({ errorCode: "SubtaskNotFound" });
    const deletedSubtask = await this.subtasks.deleteByIdAndOwner(subtaskId, ownerId);
    if (!deletedSubtask) throw new HttpNotFoundException({ errorCode: "SubtaskNotFound" });
    return { deletedSubtask };
  }

  async getSubtasksByTask(taskId: string, ownerId: string) {
    return { subtasks: await this.subtasks.findManyByTaskAndOwner(taskId, ownerId) };
  }
}

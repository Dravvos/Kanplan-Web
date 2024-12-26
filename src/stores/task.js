import { get, post, put, deletar } from "../services/api-handler";
import { getUserEmail } from "./user";

async function getTask(taskId) {
   try {
      const response = await get('Task/' + taskId);

      if (response?.status === 200)
         console.log(response);

      return response;
   }
   catch (err) {
      console.error(err);
   }
}

async function getTasks(bucketId) {
   try {
      const response = await get('Task/GetTasks/' + bucketId);
      return response;
   }
   catch (err) {
      if (err.status !== 404)
         console.error(err);
      else
         console.log(err)
   }
}

async function getTasksByName(projectId, name) {
   try {
      const response = await get('Task/GetTasks/' + projectId + "/" + name);
      return response;
   }
   catch (err) {
      if (err.status !== 404)
         console.error(err);
      else
         console.log(err)
   }
}

async function createTask(args) {
   try {
      const response = await post('Task', args)
      return response
   } catch (error) {
      console.error(error)
   }
}

async function updateTask(id, args) {
   try {
      const response = await put('Task/' + id, args)
      return response
   } catch (error) {
      console.error(error)
   }
}

async function deleteTask(id) {
   try {
      const response = await deletar('Task/' + id)
      return response
   } catch (error) {
      console.error(error)
   }
}

async function assignTaskToUser(taskId, userId) {
   try {
      const response = await post('Task/RelateTaskToUser', {
         taskId,
         usuarioId: userId,
         usuarioInclusao: getUserEmail()
      });
      return response;
   }
   catch (err) {
      console.error(err);
   }
}

async function unassignUserFromTask(taskId, userId) {
   try {
      const response = await deletar('Task/RemoveUserFromTask?taskId=' + taskId + "&userId=" + userId);
      return response;
   }
   catch (err) {
      console.error(err);
   }
}


export { getTask, getTasksByName, getTasks, createTask, updateTask, deleteTask, assignTaskToUser, unassignUserFromTask }
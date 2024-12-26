import { get, post, put, deletar } from "../services/api-handler";
import { getUserEmail } from "./user";

async function getLabel(labelId) {
   try {
      const response = await get('Label/GetLabel/' + labelId);
      return response;
   }
   catch (err) {
      console.error(err);
   }
}

async function createLabel(args) {
   try {
      const response = await post('Label', args);
      return response;
   } catch (error) {
      console.error(error)
   }
}

async function updateLabel(id, args) {
   try {
      const response = await put('Label/' + id, args);
      return response;
   } catch (error) {
      console.error(error)
   }
}

async function deleteLabel(id) {
   try {
      const response = await deletar('Label/' + id);
      return response;
   } catch (error) {
      console.error(error)
   }
}

async function getLabelsByTask(taskId) {
   try {
      const response = await get('Label/GetLabels/' + taskId);
      return response;
   } catch (err) {
      console.error(err);
   }
}

async function getDefaultLabels() {
   try {
      const response = await get('Label/GetDefaultLabels/');
      return response;
   } catch (err) {
      console.error(err);
   }
}

async function assignLabelToTask(taskId, labelId) {
   try {
      const response = await post('Task/RelateTaskToLabel', {
         taskId,
         labelId,
         usuarioInclusao: getUserEmail()
      });
      return response
   }
   catch {

   }
}


async function unassignLabelFromTask(taskId, labelId) {
   try {
      const response = await deletar('Label/RemoveLabelFromTask?labelId=' + labelId + "&taskId=" + taskId);
      return response;
   }
   catch (err) {
      console.error(err);
   }
}

async function getProjectLabels(projectId){
   try {
      const response = await get('Label/GetLabelsFromProject/' + projectId);
      return response;
   }
   catch (err) {
      console.error(err);
   }
}

export { getDefaultLabels, getLabelsByTask, getLabel, createLabel, updateLabel, deleteLabel, assignLabelToTask, unassignLabelFromTask, getProjectLabels }
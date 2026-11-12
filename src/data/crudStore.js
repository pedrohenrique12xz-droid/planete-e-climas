import { apiRequest } from './api';
const valid = new Set(['problems','solutions']);
function check(type){if(!valid.has(type))throw new Error('Tipo de cadastro inválido.')}
export async function getItems(type){check(type);const data=await apiRequest(`/${type}`);return data.items||[]}
export async function createItem(type,data){check(type);return (await apiRequest(`/${type}`,{method:'POST',body:JSON.stringify(data)})).item}
export async function updateItem(type,id,data){check(type);return (await apiRequest(`/${type}/${id}`,{method:'PUT',body:JSON.stringify(data)})).item}
export async function deleteItem(type,id){check(type);return apiRequest(`/${type}/${id}`,{method:'DELETE'})}

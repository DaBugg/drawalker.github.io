// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQBkH6yRssIjx5nKzWhqZ1OzUZgyYHIftZqLP702aGQiHczS8pIlU5fxWuZZY0AHbGmn-t81Mth7IfhnttquBdP3O22K3o6OL_90sL-AKEtegrmCNz0I5RbdSz4KzYVZ6okYVDR1MVp7cEJuMjGLleOc8Rn-4FfGjMueFrwfp2a5h-vIsdm1JXm_t4jsw-ZoXUXmHtcXkppD2W0L41YfRk93aX2PQ6YXIEmeIZOx0F2T16kQcBJHcsc-ftG_PxOA--7iQb5ZgrBpfFLNi4eh6qBjULQH6dNlNv7eI2LxL2ilk4IH4bjNnZAAxM3N7K7-V2Ol';
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}
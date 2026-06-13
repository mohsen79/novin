const getForms = async () => {
    const response = await fetch('http://localhost:3000/forms');
    return await response.json();
}

const sendForms = (data: number) => fetch('http://localhost:3000/requests', {
    method: 'post',
    body: JSON.stringify({ data: data })
}).then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err));

export { getForms, sendForms };
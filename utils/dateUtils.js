export function getCurrentDate() {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const date = new Date();
  const day = date.getDate();
  const month = months[date.getMonth()];
  
  return `${day} ${month}`;
}
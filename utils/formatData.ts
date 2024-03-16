export const formatCurrency = (value: number) => {
  const formatter = value?.toLocaleString('vi-VN') + 'đ';
  return formatter;
};

export const formatDateTime = (value: any) => {
  const date = new Date(value);
  //get day/month/year not include time
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  //get hour/minute/second
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  //return format
  return `${day}/${month}/${year}`;
};

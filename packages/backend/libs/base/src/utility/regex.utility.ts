const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!"#$%'()*+,-./]).{8,}$/;
const colorRegex = /^#[(a|b|c|d|e|f)|0-9]{6}$/;
export { passwordRegex, colorRegex };

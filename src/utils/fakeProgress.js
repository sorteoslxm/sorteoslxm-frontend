export function getFakeProgress() {
  // entre 18% y 82% → nunca vacío ni terminado
  return Math.floor(Math.random() * (82 - 18) + 18);
}

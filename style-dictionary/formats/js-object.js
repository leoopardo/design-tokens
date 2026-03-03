module.exports = {
  jsObjectFormatter: ({ dictionary }) => {
    const output = {};

    dictionary.allTokens.forEach((token) => {
      let current = output;
      const value = token.value ?? token.$value; // 🔑 AQUI ESTÁ A CHAVE

      token.path.forEach((key, index) => {
        if (index === token.path.length - 1) {
          current[key] = value;
        } else {
          current[key] ??= {};
          current = current[key];
        }
      });
    });

    return `export default ${JSON.stringify(output, null, 2)};`;
  },
};
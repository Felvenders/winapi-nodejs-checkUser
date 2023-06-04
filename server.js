const express = require('express');
const edge = require('edge-js');

const app = express();
const check = edge.func(`
    #r "System.DirectoryServices.AccountManagement.dll"

    using System;
    using System.DirectoryServices.AccountManagement;

    async (input) => {
        try {
            using (var context = new PrincipalContext(ContextType.Machine))
            {
                return UserPrincipal.FindByIdentity(context, input)?.DisplayName;
            }
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
    }
`);

app.use(express.static('templates'));
app.use(express.urlencoded({ extended: true }));

app.post('/check', async (req, res) => {
  const username = req.body.username;
  const result = await check(username);
  
  if (result) {
    res.send('Пользователь есть');
  } else {
    res.send('Пользователя нет');
  }
});

app.listen(8080, () => {
  console.log('Сервер запущен на порте 8080');
});

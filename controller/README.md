## Concernant les reponses au format json

```javascript
// utiliser
res.json({
	// ....
});

// Au lieu de 
res.json(JSON.stringify({
	// ...
}));

// Deja c'est plus court... et aussi...
// la raison est que res.json definie l'en-tete de la reponse en text/json
// tandis que la seconde version specifie l'entete par defaut sous text/plain 
// [Note] : Si la reponse a une en tete text/json, les terminaux tel que POSTMAN vont formatter le resultat d'une facon stylee
// et coloree

```



## Concernant les json

```javascript

// les reponses http
// pour les success
{
	code : 200,
	data : "boff.. comme dhab"
}


// pour les erreurs
{
	code : 400,
	error : true,
	detailed : "description en detail, par exemple le message de l'exception (facultative)",
	data : "description abregee, pour l'utilisateur. dois etre en francais"
}

// La raison est que si on a une erreur alors on peut faire directement
if ( reponse['error'] ) {
	// faire un truc (pas besoin de checker si code == 400)
} else {
	// faire un truc
}

```

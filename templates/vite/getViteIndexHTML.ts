export const getViteIndexHTML = (mainFileName: string) => {
    return /* html */`
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KIX Document</title>
</head>

<body>
  <noscript> You need to enable JavaScript to run this app. </noscript>
  <script type="module" src="${mainFileName}"></script>
</body>

</html>
    `.trim()
}
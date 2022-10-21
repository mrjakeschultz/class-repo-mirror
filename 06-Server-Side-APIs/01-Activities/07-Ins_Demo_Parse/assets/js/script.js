fetch('https://api.github.com/orgs/twitter/public_members')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log('Twitter Public Members: Raw data \n----------');
    console.log(data);
  });

fetch('https://api.github.com/orgs/twitter/repos')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log('Twitter Repositories: Names only \n----------');
    // You can log the data to see what is returned and what properties you will need.
    console.log(data)
    for (var i = 0; i < data.length; i++) {
      console.log(data[i].name);
    }
  });

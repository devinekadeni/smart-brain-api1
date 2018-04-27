const handleRegister = (req, res, db, bcrypt) => {
  const hash = bcrypt.hashSync(req.body.password);

    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email:req.body.email,
      })
      .into('login')
      .returning('id')
      .then(id => {
          db.select('email').from('login')
          .where('id', id)
          .then(email => {
            const reqEmail = email[0].email
            db('users')
            .returning('id')
            .insert({
              name: req.body.name,
              email: reqEmail,
              joined: new Date(),
            }).then(response => {
                db('users').where('id', response)
                  .then(data => res.json(data[0]))
            })
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
  }

  module.exports = {
    handleRegister: handleRegister
  }
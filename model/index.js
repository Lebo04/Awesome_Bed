//----- Import database connection from the config folder
let db = require("../config");
//----- Import bcrypt module
let { hash, compare, hashSync } = require("bcrypt");
//
let { createToken } = require("../middleware//AuthenticatedUser");

//-------- User class
class User {
  login(req, res) {
    const { emailAdd, userPwd } = req.body;
    const strQry = `
        SELECT userID, firstName, lastName, gender, emailAdd, userPwd, userRole, userProfile
        FROM Users
        WHERE emailAdd = ${emailAdd};
    `;
    db.query(strQry, async (err, data) => {
      if (err) throw err;
      if (!data || data == null) {
        res.status(401).json({ err: "Incorrect email address" });
      } else {
        await compare(userPwd, data[0].userPwd, (cErr, cResult) => {
          if (cErr) throw cErr;
          // Create token
          const jwToken = createToken({
            emailAdd,
            userPwd,
          });
          //---- Saving our token
          res.cookie("LegitUser", jwToken, {
            maxAge: 3600000,
            httpOnly: true,
          });
          if (cResult) {
            request.status(200).json({
              msg: "Logged In",
              jwToken,
              result: data[0],
            });
          } else {
            res.status(401).json({
              err: "Incorrect Password, try again or register",
            });
          }
        });
      }
    });
  }
  fetchUsers(req, res) {
    const strQry = `
        SELECT userID, firstName, lastName, gender, emailAdd, userRole, userProfile
        FROM Users;
        `;
    db.query(strQry, (err, data) => {
      if (err) throw err;
      else res.status(200).json({ results: data });
    });
  }
  fetchUser(req, res) {
    const strQry = `
        SELECT userID, firstName, lastName, gender, emailAdd, userRole, userProfile
        FROM Users
        WHERE UserID = ?;
        `;
    db.query(strQry, [req.params.id], (err, data) => {
      if (err) throw err;
      else res.status(200).json({ result: data });
    });
  }
  async createUser(req, res) {
    // Payload
    let detail = req.body;
    // Hashing user password
    detail.userPwd = await hash(detail.userPwd, 15);
    // This information will be used for authentication.
    let user = {
      emailAdd: detail.emailAdd,
      userPwd: detail.userPwd,
    };
    // sql query
    const strQry = `INSERT INTO Users
    SET ?;`;
    db.query(strQry, [detail], (err) => {
      if (err) {
        res.status(401).json({ err });
      } else {
        // Create a token
        const jwToken = createToken(user);
        // This token will be saved in the cookie.
        // The duration is in milliseconds.
        res.cookie("LegitUser", jwToken, {
          maxAge: 3600000,
          httpOnly: true,
        });
        res.status(200).json({ msg: "A user record was saved." });
      }
    });
  }
  updateUser(req, res) { 
    let data = req.body;
    if (data.userPwd !== null || data.userPwd !== undefined)
      data.userPwd = hashSync(data.userPwd, 15);
    const strQry = `
    UPDATE Users
    SET ?
    WHERE userID = ?;
    `;
    //db
    db.query(strQry, [data, req.params.id], (err) => {
      if (err) throw err;
      res.status(200).json({ msg: "A row was affected" });
    });
  }
  deleteUser(req, res) {
    const strQry = `
    DELETE FROM Users
    WHERE userID = ?;
    `;
    //db
    db.query(strQry, [req.params.id], (err) => {
      if (err) throw err;
      res.status(200).json({ msg: "A record was removed from a database" });
    });
  }
}

class Product {
    fetchProducts(req, res) {
        const strQry = `SELECT prodID, prodName, prodDescription, category, prodPrice, prodQuantity, imgURL
        FROM Products;`;
        db.query(strQry, (err, results)=> {
            if(err) throw err;
            res.status(200).json({results: results})
        });
    }
    fetchProduct(req, res) {
        const strQry = `SELECT prodID, prodName, prodDescription, category, prodPrice, prodQuantity, imgURL
        FROM Products
        WHERE prodID = ?;`;
        db.query(strQry, [req.params.id], (err, results)=> {
            if(err) throw err;
            res.status(200).json({results: results})
        });

    }
    addProduct(req, res) {
        const strQry = 
        `
        INSERT INTO Products
        SET ?;
        `;
        db.query(strQry,[req.body],
            (err)=> {
                if(err){
                    res.status(400).json({err: "Unable to insert a new record."});
                }else {
                    res.status(200).json({msg: "Product saved"});
                }
            }
        );    

    }
    updateProduct(req, res) {
        const strQry = 
        `
        UPDATE Products
        SET ?
        WHERE prodID = ?
        `;
        db.query(strQry,[req.body, req.params.id],
            (err)=> {
                if(err){
                    res.status(400).json({err: "Unable to update a record."});
                }else {
                    res.status(200).json({msg: "Product updated"});
                }
            }
        );    

    }
    deleteProduct(req, res) {
        const strQry = 
        `
        DELETE FROM Products
        WHERE prodID = ?;
        `;
        db.query(strQry,[req.params.id], (err)=> {
            if(err) res.status(400).json({err: "The record was not found."});
            res.status(200).json({msg: "A product was deleted."});
        })
    }

}
// Export User class
module.exports = {
    User, 
    Product
}
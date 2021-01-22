require("dotenv").config();

let final_params = {
  'drink_name': NaN,
  'drink_type':NaN,
  'drink_size':NaN,
  'price':NaN,
  'order_type':NaN,
  'product_name':NaN
};


exports.foodFunction = async (req, res) => {
  const { MongoClient } = require("mongodb");
  const CONNECTION_URI = process.env.MONGODB_URI;

  const client = new MongoClient(CONNECTION_URI, {
    useNewUrlParser: true,
  });

  // initate a connection to the deployed mongodb cluster
  client.connect((err) => {
    if (err) {
      res
        .status(500)
        .send({ status: "MONGODB CONNECTION REFUSED", error: err });
    }

    const collection = client.db(process.env.DATABASE_NAME).collection("Meals");
    const { displayName } = req.body.queryResult.intent;

    const result = [];

    switch (displayName) {

      case "menu-start":
        const data = collection.find({});
        const meals = [
          {
            text: {
              text: [
                `We currently have the following 20 drinks on our menu list. Which would you like to request for?`,
              ],
            },
          },
        ];
        result.push(
          data.forEach((item) => {
            const {
              name,
              price
            } = item;
            const card = {
              card: {
                title: `${name} at $${price}`
              },
            };
            meals.push(card);
          })
        );
        return Promise.all(result)
          .then((_) => {
            const response = {
              fulfillmentMessages: meals,
            };
            res.status(200).json(response);
          })
          .catch((e) => res.status(400).send({ error: e }));
      
      case "get-order-type":
        const cur_params = req.body.queryResult.parameters;
      
        final_params.order_type = cur_params.order_type;
       
        const singleCard = [
          {
            text: {
              text: [`Thanks for choosing the Order type: ${cur_params.order_type}. Please review the order Confirmation`],
            },
          }];
        const card_drink = {
          card: {
            title: `Drink: ${final_params.drink_name}`,
          },
        };
        singleCard.push(card_drink);
        const card_type = {
          card: {
            title: `Type of Drink: ${final_params.drink_type}`,
          }
        };
        singleCard.push(card_type);
        const card_size = {
          card: {
            title: `Size of Drink: ${final_params.drink_size}`,
          }
        };
        singleCard.push(card_size);
        const card_price = {
          card: {
            title: `Total Price of Order is ${final_params.product_name} is: $${final_params.price}`,
          },
        };
        singleCard.push(card_price);

        const payment_card = {
          card: {

            text: {
              text: [`-----------If your order is confirmed---------`],
            },
              
            title: `Please choose the Payment type`,
            buttons: [
              {
                text: "Cash",
                postback: "htts://google.com",
              },
              {
                text: "Card",
                postback: "htts://google.com",
              },
              {
                text: "Wallet",
                postback: "htts://google.com",
              },
            ],
          }

        };
        singleCard.push(payment_card);

        return Promise.all(result)
        .then((_) => {
          const response = {
            fulfillmentMessages: singleCard,
          };
          res.status(200).json(response);
        })
        .catch((e) => res.status(400).send({ error: e }));
        

      case "get-drink-size":
        const params = req.body.queryResult.parameters;
        console.log(params);
        const req_drink = params.beverage_size+" "+params.beverage_type+" "+params.beverages;
        console.log(req_drink);

        //adding the params
        final_params.drink_name = params.beverages;
        final_params.drink_size = params.beverage_size;
        final_params.drink_type = params.beverage_type;
        final_params.product_name = req_drink;

        collection.findOne({ name: req_drink }, (err, data) => {
          if (err) {
            res.status(400).send({ error: err });
          }
          console.log(data);
          const { name, price } = data;
          
          //adding the params
          final_params.price = price;

          const singleCard = [
            {
              text: {
                text: [`Thanks for choosing the ${req_drink}. The ${name} is currently priced at $${price}.`],
              },
            },
            {
              card: {
                title: `Please choose the Order type`,
                buttons: [
                  {
                    text: "Take Away",
                    postback: "htts://google.com",
                  },
                  {
                    text: "Have it here",
                    postback: "htts://google.com",
                  },
                ],
              },
            },
          ];
          return Promise.all(result)
          .then((_) => {
            const response = {
              fulfillmentMessages: singleCard,
            };
            res.status(200).json(response);
          })
          .catch((e) => res.status(400).send({ error: e }));
 
        })

      case "request-drinkitem":
        const { drink } = req.body.queryResult.parameters;

        // const names = drink.split(" ");

       
        collection.findOne({ name: drink }, (err, data) => {
          if (err) {
            res.status(400).send({ error: err });
          }
          console.log(data);
          const { name, price } = data;
          const singleCard = [
            {
              text: {
                text: [`The ${name} is currently priced at $${price}.`],
              },
            },
            {
              card: {
                title: `${name} at $${price}`,
                buttons: [
                  {
                    text: "Pay For Meal",
                    postback: "htts://google.com",
                  },
                ],
              },
            },
          ];
          return Promise.all(result)
          .then((_) => {
            const response = {
              fulfillmentMessages: singleCard,
            };
            res.status(200).json(response);
          })
          .catch((e) => res.status(400).send({ error: e }));
 
        })
        
        default:
            break;
    }
    client.close();
  });
};

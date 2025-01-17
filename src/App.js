import Table from "./components/Table";
import { useQuery } from "urql";
import GET_COUNTRIES from "./graphql/queries/getCountries";
import { useEffect, useState } from "react";
import {selectionSetMatchesResult} from "@apollo/client/cache/inmemory/helpers";

// https://developer.adobe.com/commerce/webapi/graphql/tutorials/checkout/add-product-to-cart/
// https://developer.adobe.com/commerce/webapi/graphql/schema/cart/mutations/update-items/
// https://developer.adobe.com/commerce/webapi/graphql/schema/cart/mutations/remove-item/

const fetchGraphQL= (params) =>{

    // var command='';
    // console.log('=== command ',command)

  return fetch('http://mage2rock.magento.com/graphql', {
    method: 'post',
    mode:'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({query: params.gqlRequest})
  }).then((responseData) => {
    responseData.json().then((d) => {
        console.log("=== responseData ",params.entityName,d)
        params.setDataCallback(d)
    })
  }).catch((e) => {
    console.log('=== setError countries ',e)
    console.log(e)
  })
}

function App() {

  const [data, setData] = useState()
  const [keys, setKeys] = useState()
  const [result, reexecuteQuery] = useQuery({
    query: GET_COUNTRIES,
  });
        useEffect(() => {

          //=== ALL products(filter: {name:{match:""}} ) {
          fetchGraphQL({
            entityName:'products',
            setDataCallback:(d)=>{
              setData((prevState) => { return{ ...prevState,
                products: d.data.products
              }})
            },
            gqlRequest:
                 `{
                  products(filter: {name:{match:""}} ) {
                    total_count,
                    items{
                        uid
                        name
                        categories {
                            uid
                        }
                    }
                  }
                }`
            })

          fetchGraphQL({
              entityName: 'countries',
              setDataCallback: (d) => {
                  setData((prevState) => {
                      return {
                          ...prevState,
                          countries: d.data.countries
                      }
                  })
              },
              gqlRequest:
                `{
                  countries {
                    full_name_english
                    full_name_locale
                    id
                    three_letter_abbreviation
                    two_letter_abbreviation
                  }
                }`
          })

        },[])

  return (
      <div style={{gap:'5px',alignItems:'center',width:'100%',display:'flex',flexDirection:'column'}}>
          {!data?.cartID?null:
              <div style={{width:'50%'}}>
              <button
                  style={{width:'100%',paddingTop:'5px',paddingBottom:'5px'}}
                  onClick={()=>{
                      const DELETE_CART_MUTATION = `
                            mutation {
                              removeItemFromCart(
                                input: {
                                  cart_id: "`+data.cartID+`",
                                  cart_item_id: "`+data?.cart_item_id+`"
                                }
                              )
                             {
                              cart {
                                itemsV2 {
                                  items {
                                    id
                                    product {
                                      name
                                    }
                                    quantity
                                  }
                                  total_count
                                  page_info {
                                    page_size
                                    current_page
                                    total_pages
                                  }
                                }
                                prices {
                                  grand_total{
                                    value
                                    currency
                                  }
                                }
                              }
                             }
                            }                        `;

                    fetchGraphQL({
                        entityName:'DELETE_CART_MUTATION',
                        setDataCallback:(d)=>{
                            console.log('=== DELETE_CART_MUTATION response ',d.data?.removeItemFromCart?.cart?.itemsV2?.items)
                            console.log('=== DELETE_CART_MUTATION response ',d.data?.removeItemFromCart?.cart?.itemsV2?.items[0])
                            //
                            setData((prevState) => { return{ ...prevState,
                                cart_items:d.data?.removeItemFromCart?.cart?.itemsV2?.items
                            }})

                        },
                        gqlRequest:DELETE_CART_MUTATION,
                        variables:{
                            cartId:data.cartID,
                        }
                    })
                  }}
              >
                  DELETE CART ITEM
              </button>
              </div>
          }
          {!data?.cartID?null:
              <div style={{width:'50%'}}>
              <button
                  style={{width:'100%',paddingTop:'5px',paddingBottom:'5px'}}
                  onClick={()=>{

                      const UPDATE_CART_MUTATION = `
                        mutation {
                          updateCartItems(
                            input: {
                              cart_id: "`+data.cartID+`",
                              cart_items: [
                                {                                  
                                  cart_item_uid: "`+data?.cart_item_uid+`"
                                  quantity: 8
                                }
                              ]
                            }
                          ){
                            cart {
                              itemsV2 {
                                items {
                                  id
                                  uid
                                  product {
                                    name
                                  }
                                  quantity
                                }
                                total_count
                                page_info {
                                  page_size
                                  current_page
                                  total_pages
                                }
                              }
                              prices {
                                grand_total{
                                  value
                                  currency
                                }
                              }
                            }
                          }
                        }
                        `;

                    fetchGraphQL({
                        entityName:'UPDATE_CART_MUTATION',
                        setDataCallback:(d)=>{
                            console.log('=== UPDATE_CART_MUTATION response ',d.data?.updateCartItems?.cart?.itemsV2?.items)
                            console.log('=== UPDATE_CART_MUTATION response ',d.data?.updateCartItems?.cart?.itemsV2?.items[0])

                            setData((prevState) => { return{ ...prevState,
                                cart_items:d.data?.updateCartItems?.cart?.itemsV2?.items
                            }})

                        },
                        gqlRequest:UPDATE_CART_MUTATION,
                        variables:{
                            cartId:data.cartID,
                        }
                    })
                  }}
              >
                  UPDATE CART ITEM
              </button>
              </div>
          }

          {!data?.cartID?null:
              <div style={{width: '50%'}}>
              <button
                style={{width:'100%',paddingTop:'5px',paddingBottom:'5px'}}
                onClick={()=>{

                      const CREATE_CART_MUTATION = `
                            mutation {
                              addSimpleProductsToCart(
                                input: {
                                  cart_id: "`+data.cartID+`",
                                  cart_items: [
                                    {
                                      data: {
                                        quantity: 1
                                        sku: "0101"
                                      }
                                    }
                                  ]
                                }
                              ) {
                                cart {
                                  itemsV2 {
                                    items {                                      
                                      uid
                                      id
                                      product {
                                        sku
                                        stock_status
                                      }
                                      quantity
                                    }
                                  }
                                }
                              }
                            }                      
                        `;

                    fetchGraphQL({
                        entityName:'CREATE_CART_MUTATION',
                        setDataCallback:(d)=>{
                            console.log('=== CREATE_CART_MUTATION response ',d.data?.addSimpleProductsToCart?.cart?.itemsV2?.items)
                            const itemUid = d.data?.addSimpleProductsToCart?.cart?.itemsV2?.items[0].uid
                            const itemId = d.data?.addSimpleProductsToCart?.cart?.itemsV2?.items[0].id
                            console.log('=== itemUid    ',itemUid)
                            console.log('=== itemId     ',itemId)
                            setData((prevState) => { return{ ...prevState,
                                cart_item_uid: itemUid,
                                cart_item_id: itemId,
                                cart_items:d.data?.addSimpleProductsToCart?.cart?.itemsV2?.items
                            }})
                        },
                        gqlRequest:CREATE_CART_MUTATION,
                        variables:{
                            cartId:data.cartID,
                        }
                    })
                  }}
              >
                  CREATE CART ITEM
              </button>
              </div>
          }

          {!data?.cartID?null:
              <div style={{width: '50%'}}>
              <button
                style={{width:'100%',paddingTop:'5px',paddingBottom:'5px'}}
                onClick={()=>{

                      const READ_CART_MUTATION = `
                            {
                              cart(
                                cart_id: "`+data.cartID+`") { 
                                email
                                billing_address {
                                  city
                                  country {
                                    code
                                    label
                                  }
                                  firstname
                                  lastname
                                  postcode
                                  region {
                                    code
                                    label
                                  }
                                  street
                                  telephone
                                }
                                shipping_addresses {
                                  firstname
                                  lastname
                                  street
                                  city
                                  region {
                                    code
                                    label
                                  }
                                  country {
                                    code
                                    label
                                  }
                                  telephone
                                  available_shipping_methods {
                                    amount {
                                      currency
                                      value
                                    }
                                    available
                                    carrier_code
                                    carrier_title
                                    error_message
                                    method_code
                                    method_title
                                    price_excl_tax {
                                      value
                                      currency
                                    }
                                    price_incl_tax {
                                      value
                                      currency
                                    }
                                  }
                                  selected_shipping_method {
                                    amount {
                                      value
                                      currency
                                    }
                                    carrier_code
                                    carrier_title
                                    method_code
                                    method_title
                                  }
                                }
                                itemsV2 {
                                  total_count
                                  items {
                                    uid
                                    id
                                    product {
                                      name
                                      sku
                                    }
                                    quantity
                                  }
                                  page_info {
                                    page_size
                                    current_page
                                    total_pages
                                  }
                                }      
                                available_payment_methods {
                                  code
                                  title
                                }
                                selected_payment_method {
                                  code
                                  title
                                }
                                applied_coupons {
                                  code
                                }
                                prices {
                                  grand_total {
                                    value
                                    currency
                                  }
                                }
                              }
                            }
                        `;

                    fetchGraphQL({
                        entityName:'READ_CART_MUTATION',
                        setDataCallback:(d)=>{
                            console.log('=== READ_CART_MUTATION response items',d.data?.cart?.itemsV2?.items)
                            console.log('=== READ_CART_MUTATION response items[0]',d.data?.cart?.itemsV2?.items[0])
                            if(d.data?.cart?.itemsV2?.items.length!==0) {
                                const itemUid = d.data?.cart?.itemsV2?.items[0].uid
                                const itemId = d.data?.cart?.itemsV2?.items[0].id
                                console.log('=== itemUid    ', itemUid)
                                console.log('=== itemId     ', itemId)
                                setData((prevState) => {
                                    return {
                                        ...prevState,
                                        cart_item_uid: itemUid,
                                        cart_item_id: itemId,
                                        cart_items: d.data?.cart?.itemsV2?.items
                                    }
                                })
                            }                        },
                        gqlRequest:READ_CART_MUTATION,
                        variables:{
                            cartId:data.cartID,
                        }
                    })
                  }}
              >
                  READ CART
              </button>
              </div>
          }

          <div style={{width:'50%'}}>
          <button
              style={{width:'100%',paddingTop:'5px',paddingBottom:'5px'}}
              onClick={()=>{

                fetchGraphQL({
                    entityName:'createEmptyCart',
                    setDataCallback:(d)=>{
                        console.log('=== createEmptyCart ',d.data?.createEmptyCart)
                        setData((prevState) => { return{ ...prevState,
                            cartID: d.data.createEmptyCart
                        }})

                    },
                    gqlRequest:` mutation { createEmptyCart} `
                })
              }}
          >
              createEmptyCart
          </button>
          </div>

        <div>cart_item_id {data?.cart_item_id}</div>

        <div>cart_item_uid {data?.cart_item_uid}</div>

        <div>cartID {data?.cartID}</div>

        <div>cart_items</div>
        <div>{JSON.stringify(data?.cart_items)}</div>

        <div>products {data?.products?.items.length}</div>
        <div>countries {data?.countries.length}</div>
        {/*<div>{JSON.stringify(data)}</div>*/}
        <br/>
        {(!data?.countries)?'no data':
          <div>
            {data.countries.map((el,ii)=>{
              return <div key={ii}>{el.id} {JSON.stringify(el.full_name_english)}</div>
            })}
          </div>
        }
      </div>
  );
}

export default App;

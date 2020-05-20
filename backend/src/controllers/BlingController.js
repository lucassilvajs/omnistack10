const Bling = require('../models/Bling');
const axios = require('axios');
const parseStringAsArray = require('../utils/parseStringAsArray');

const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : '',
  database : 'qoculos'
});

const apis = [
    {
        loja: '113',
        token: '82cf1b8fa5280b2f8e28bd6254a67cf6558246f0d6b1e265865e93f1dd9f72a569aa6037'
    }
]

module.exports = {
    // async index(req, res){
    //     const { latitude, longitude, techs } = req.query

    //     const techsArr = parseStringAsArray(techs);

    //     const devs = await Dev.find({
    //         techs: {
    //             $in: techsArr,
    //         },
    //         location: {
    //             $near: {
    //                 $geometry: {
    //                     type: 'Point',
    //                     coordinates: [longitude, latitude]
    //                 },
    //                 $maxDistance: 10000
    //             }
    //         }
    //     })

    //     return res.json(devs);
    // }

    async get(req, res) {
        const {lojaTarget} = req.query;
        const bling = [
            // {
            //     store: '101',
            //     api: '9d3d9bafb4d0bcd27123e8778ced7a349ab9d33ec578a6afd32e8146bd287ffcff2dfa99'
            // },// FOI
            // {
            //     store: '105',
            //     api: 'a142dbfccafb7f8fdf19efdf75a2495853f9f2ae976e5432e8ec91ed3df6b55410994058'
            // },
            // {
            //     store: '106',
            //     api: '36a942c231330b9ca15f0748c9e58481af139b18ff74bf9f72921733859c83276d5847e9'
            // },
            {
                store: '104',
                api: 'cc060a3f8195bd07b6765fd6420702c663bc0a0df0b48ed4dd607677886871dea03c4dfe'
            },
            {
                store: '107',
                api: '7374bce4bb179bf819c899f1cb8ed540f7dfe89fb844aa095711a62f83b34348d15f0b76'
            },
            {
                store: '108',
                api: '460caaf47a0e32ac857ff07261f6582237286cb7f1a8fb1aeac685b202a192cf43e86ebe'
            },
            {
                store: '110',
                api: '0b19d3e05b607cde0a5b960a94aa2c0e5bf72f72973b3fdba327c17131e96ef949a01eac'
            },
            {
                store: '109',
                api: 'fbc5eaafe17eaceee1b99a54650bbf40236ce58155e890dfec11079f9de7217417200135'
            },
            {
                store: '111',
                api: '7104cc7989002d59d5a261c596415712d8bc8a48abb498de8c13418c7228ec296e823090'
            },
            {
                store: '112',
                api: '4445ad812ec54a9560d463c5def0fea39fa4cfeaa853a9258fcfa7366b040b4aa227092c'
            },
            {
                store: '113',
                api: '82cf1b8fa5280b2f8e28bd6254a67cf6558246f0d6b1e265865e93f1dd9f72a569aa6037'
            },
        ];

        bling.forEach(async store => {
            if(store.store == lojaTarget) {
                let page = 1;
                let status = true;
                let resp = [];
                console.log('Starting store: ' + store.store);
                for(i=1; i<=511;i++) {
                    let response = await axios.get(`https://bling.com.br/Api/v2/produtos/page=${i}/json?apikey=${store.api}&estoque=S`);
                    if(response.data.retorno.erros) {
                        status = false;
                    }else{
                        response.data.retorno.produtos.forEach(async (r, index)=> {
                            let {codigo, descricao, estoqueAtual, preco, class_fiscal, gtin, gtinEmbalagem} = r.produto;
                            preco = preco * 100
                            await Bling.create({
                                codigo,
                                descricao,
                                preco,
                                estoqueAtual,
                                class_fiscal,
                                gtin,
                                gtinEmbalagem,
                                store: store.store
                            });
        
                        });                
                    }
                    console.log(i);
                }
            }
        });

        res.json({completed: true})
    },

    async corrigePai(req, res){

    //    queryMaster = `SELECT * FROM catalog_product_entity LIMIT 59995, 5000`;
    //     let i = 0;
    //    connection.query(queryMaster, async function(error, results, fields){
    //        if(error) {
    //            return res.json(error);
    //        }
    //        else{
    //            let i = 0;
    //             results.forEach(async (element, index) => {
    //                 let hasProduct = await Bling.findOne({
    //                     codigo: element.sku
    //                 });

    //                 if(!hasProduct) {
    //                     console.log(`${i++} - ${index} - ${element.entity_id} - ${element.sku}`)
    //                 }

    //             });                
    //             res.json({nome: 'LUCAS'});
    //             connection.end();
    //             console.log('executou!');
    //        }
    //    });

        queryMaster = `
            SELECT
                e.entity_id AS 'id',
                e.sku,
                v0.value AS 'gtin',
                ncm.value AS 'ncm',
                cor.value AS 'Cor',
                tam.value AS 'Tamanho',
                marcastr.value AS 'marca',
                v1.value AS 'name',
                si.qty AS 'stock',
                d1.value AS 'price',
                vgtin.VALUE AS 'gtinInternacional'
            FROM catalog_product_entity e
            LEFT JOIN cataloginventory_stock_item si ON e.entity_id = si.product_id
            LEFT JOIN catalog_product_entity_varchar ncm ON e.entity_id = ncm.entity_id
                AND ncm.store_id = 0
                AND ncm.attribute_id = 209
            LEFT JOIN catalog_product_entity_varchar v0 ON e.entity_id = v0.entity_id
                AND v0.store_id = 0
                AND v0.attribute_id = 220
            LEFT JOIN catalog_product_entity_varchar cor ON e.entity_id = cor.entity_id
                AND cor.store_id = 0
                AND cor.attribute_id = 207
            LEFT JOIN catalog_product_entity_varchar vgtin ON e.entity_id = vgtin.entity_id 
                AND vgtin.store_id = 0 
                AND vgtin.attribute_id = 244
            LEFT JOIN catalog_product_entity_int marca ON e.entity_id = marca.entity_id
                AND marca.store_id = 0
                AND marca.attribute_id = 185
            LEFT JOIN eav_attribute_option_value marcastr ON marca.value = marcastr.option_id
            LEFT JOIN catalog_product_entity_int ta ON e.entity_id = ta.entity_id
                AND ta.store_id = 0
                AND ta.attribute_id = 208
            LEFT JOIN eav_attribute_option_value tam ON ta.value = tam.option_id
            LEFT JOIN catalog_product_entity_varchar v1 ON e.entity_id = v1.entity_id
                AND v1.store_id = 0
                AND v1.attribute_id = 71
            LEFT JOIN          
            catalog_product_entity_varchar v2 ON e.entity_id = v2.entity_id
                AND v2.store_id = 0
                AND v2.attribute_id = 85
            LEFT JOIN catalog_product_entity_decimal d1 ON e.entity_id = d1.entity_id
                AND d1.store_id = 0
                AND d1.attribute_id = 75
                LIMIT 15000, 40000
        `;

        connection.query(queryMaster, async function(error, results, fields){
            if(error) {
                return res.json(error);
            }
            else{
                let xml = '';
                let i = 0;
                results.forEach(async element => {
                    let response = await Bling.find({
                        codigo: element.sku,
                        store: '101'
                    });

                    try {
                        typeof response[0].codigo
                        if(element.sku == response[0].codigo && element.price == (response[0].preco/100) && element.ncm == response[0].class_fiscal && element.estoqueAtual == 0) {
                            // console.log('Correto')
                        }else{
                            if(!Number.isInteger(response[0].estoqueAtual)) {
                                // EDITA
                                console.log(element.sku);
                                setTimeout(async () => {
                                    xml = `<?xml version="1.0" encoding="UTF-8"?>
                                    <produto>
                                        <codigo>${element.sku}</codigo>
                                        <un>Un</un>
                                        <vlr_unit>${element.price.toFixed(2)}</vlr_unit>
                                        <estoque>${element.stock}</estoque>
                                        <gtin>${element.gtin}</gtin>
                                        <class_fiscal>${element.ncm}</class_fiscal>
                                    </produto>`;
                                    xml = encodeURIComponent(xml);
                                    const response = axios.post(`https://bling.com.br/Api/v2/produto/${element.sku}/json/?apikey=9d3d9bafb4d0bcd27123e8778ced7a349ab9d33ec578a6afd32e8146bd287ffcff2dfa99&xml=${xml}`);
                                    // res.json(response.data)
                                }, 120);
                            }
                            
                            
                        }
                    } catch (error) {
                        // setTimeout(() => {
                        //     xml = `<?xml version="1.0" encoding="UTF-8"?>
                        //     <produto>
                        //         <codigo>${element.sku}</codigo>
                        //         <descricao>${element.name}</descricao>
                        //         <situacao>Ativo</situacao>
                        //         <class_fiscal>${element.ncm}</class_fiscal>
                        //         <un>Un</un>
                        //         <vlr_unit>${element.price.toFixed(2)}</vlr_unit>
                        //         <peso_liq>0.2</peso_liq>
                        //         <estoque>${element.stock}</estoque>
                        //         <gtin>${element.gtin}</gtin>
                        //         <gtinEmbalagem>${element.gtinInternacional}</gtinEmbalagem>
                        //     </produto>`;
                        //     xml = encodeURIComponent(xml);
                        //     const response = axios.post(`https://bling.com.br/Api/v2/produto/${element.sku}/json/?apikey=9d3d9bafb4d0bcd27123e8778ced7a349ab9d33ec578a6afd32e8146bd287ffcff2dfa99&xml=${xml}`);
                        // }, 120);
                    }

                    i++;

                    if(i%100 == 0) {
                        console.log(i);
                    }
                    // console.log(`element.sku = ${element.sku} - response.codigo = ${response.codigo}`);
                    // console.log(`element.price = ${element.price} - response.preco = ${response.preco}`);
                });
                // console.log(xml)
                // console.log(`https://bling.com.br/Api/v2/produto/json?apikey=9d3d9bafb4d0bcd27123e8778ced7a349ab9d33ec578a6afd32e8146bd287ffcff2dfa99&xml=${xml}`)
                // console.log('executou!');
                // console.log(response)
            }
        });

        // res.json({complet: true});
        console.log('Fim...');
        
//     });
//     res.send(`https://bling.com.br/Api/v2/produto/json?apikey=9d3d9bafb4d0bcd27123e8778ced7a349ab9d33ec578a6afd32e8146bd287ffcff2dfa99&xml=${xml}`)
    
    },

    async edit(req, res){
        const {lojaTarget} = req.query;

        const bling = [
            // {
            //     store: '101',
            //     token: '9d3d9bafb4d0bcd27123e8778ced7a349ab9d33ec578a6afd32e8146bd287ffcff2dfa99'
            // },// FOI
            {
                store: '105',
                token: 'a142dbfccafb7f8fdf19efdf75a2495853f9f2ae976e5432e8ec91ed3df6b55410994058'
            },
            {
                store: '106',
                token: '36a942c231330b9ca15f0748c9e58481af139b18ff74bf9f72921733859c83276d5847e9'
            },
            {
                store: '104',
                token: 'cc060a3f8195bd07b6765fd6420702c663bc0a0df0b48ed4dd607677886871dea03c4dfe'
            },
            {
                store: '107',
                token: '7374bce4bb179bf819c899f1cb8ed540f7dfe89fb844aa095711a62f83b34348d15f0b76'
            },
            {
                store: '108',
                token: '460caaf47a0e32ac857ff07261f6582237286cb7f1a8fb1aeac685b202a192cf43e86ebe'
            },
            {
                store: '110',
                token: '0b19d3e05b607cde0a5b960a94aa2c0e5bf72f72973b3fdba327c17131e96ef949a01eac'
            },
            {
                store: '109',
                token: 'fbc5eaafe17eaceee1b99a54650bbf40236ce58155e890dfec11079f9de7217417200135'
            },
            {
                store: '111',
                token: '7104cc7989002d59d5a261c596415712d8bc8a48abb498de8c13418c7228ec296e823090'
            },
            {
                store: '112',
                token: '4445ad812ec54a9560d463c5def0fea39fa4cfeaa853a9258fcfa7366b040b4aa227092c'
            },
            // {
            //     store: '113',
            //     token: '82cf1b8fa5280b2f8e28bd6254a67cf6558246f0d6b1e265865e93f1dd9f72a569aa6037'
            // },
        ];



        const token = bling.filter(r => r.store == lojaTarget)[0].token;

        console.log(token)
        console.log(lojaTarget)
        typeof token;
        const pai = await Bling.find({
            store: '101',
        }).limit(40000).skip(27400);

        cad = 0;
        edit = 0;
        i=0;
        pai.forEach(async element => {
            let filho  = await Bling.find({
                store: lojaTarget,
                codigo: element.codigo
            });

            if(filho.length == 0) {
                //Criar
                setTimeout(() => {
                    xml = `<?xml version="1.0" encoding="UTF-8"?>
                        <produto>
                            <codigo>${element.codigo}</codigo>
                            <descricao>${element.descricao}</descricao>
                            <situacao>Ativo</situacao>
                            <class_fiscal>${element.class_fiscal}</class_fiscal>
                            <un>Un</un>
                            <vlr_unit>${element.preco / 100}</vlr_unit>
                            <peso_liq>0.2</peso_liq>
                            <gtin>${element.gtin}</gtin>
                            <gtinEmbalagem>${element.gtinInternacional}</gtinEmbalagem>
                        </produto>`;
                        const response = axios.post(`https://bling.com.br/Api/v2/produto/json?apikey=${token}&xml=${xml}`);
                }, 130);
            }else{
                if(element.preco != filho[0].preco) {
                    setTimeout(() => {
                        // console.log(`E ${edit++}`);
                        xml = `<?xml version="1.0" encoding="UTF-8"?>
                        <produto>
                            <codigo>${element.codigo}</codigo>
                            <vlr_unit>${(Number(element.preco) / 100)}</vlr_unit>
                            <gtin>${element.gtin}</gtin>
                            <class_fiscal>${element.class_fiscal}</class_fiscal>
                        </produto>`;
                        xml = encodeURIComponent(xml);
                        const response = axios.post(`https://bling.com.br/Api/v2/produto/${element.codigo}/json/?apikey=${token}&xml=${xml}`)
                    }, 130);
                }else{
                }
            }

            i++;
            if(i%100 == 0) {
                console.log(i)
            }
        });
        res.json({status: true});
    }
}
const fs = require('fs');
function filter(container, _filter){
	let ret = [];
	container.forEach(item => {
		let canpush = true;
		_filter.forEach(_item => {
            console.log(item.phone, '===', _item.phone);
			if(_item.phone === item.phone) {
				canpush = false;
				return;
			}
		})
		if(canpush){
			ret.push(item);
		}
	})
    return ret;
}



var allAccounts = require("./accounts/shanghai231310115001.json");
console.log('allAccounts', allAccounts);
let out = filter(
    allAccounts,
    [
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "231310115001",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "211110105016",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "",
            "orderId": null
        }
    },
    {
        "phone": "13935327172",
        "pass": "a123456",
        "addressId": 1930782,
        "order": {
            "receiptPhone": null,
            "sid": "211110105016",
            "orderId": null
        }
    }
]
);
console.log(JSON.stringify(out, null, 4));

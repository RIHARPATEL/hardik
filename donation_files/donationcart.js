if (!donationcart) var donationcart = function(){};
if (!donationcart.classes) donationcart.classes = function(){};

donationcart.classes.CartItem = jscLib.libFuncs.subclass(jscLib.system.extendedObject, "Donation Cart Item");
donationcart.classes.CartItem.create = function(param){
    var _proto = this.prototype;
    
    _proto.init = function(param){
        if (param.cart == null) throw new jscLib.system.ESystem( { message: "Cart item must be associated to a donation cart", sysObject: _proto.self() } );
        this.cart = param.cart;
        this.itemcode = param.itemcode;
        if (param.isSplit && param.isSplit == true){
            this.isSplit = true;
            this.breakup = new Object();
        } else {
            this.isSplit = false;
            this.breakup = null;
        }
        this.units = 0;
        if (param.unit){
            this.units = param.unit;
        } 
        
        if (param.amount){
            this.amount = param.amount;
        }
        
        if (param.causeCategory){
            this.causeCategory = param.causeCategory;
        }
        
        if (param.charityID){
            this.charityID = param.charityID;
        }
        
        if (param.causeText){
            this.causeText = param.causeText;
        }
        
        if (param.charityText){
            this.charityText = param.charityText;
        }
        
        if (param.minAmount){
            this.minAmount = param.minAmount;
        }
		
		if (param.notes){
			this.notes = param.notes;
		}
    }
    
    _proto.getCauseCode = function(){
        return this.itemcode;
    }
    
    _proto.getItemTotal = function(){
        var result = 0;
        if (this.isSplit && this.isSplit == true){
            for(var breakup in this.breakup){
                result += this.breakup[breakup] * this.getUnits();
            }           
        } else {
            result = this.getAmount() * this.getUnits();
        }
        return result;
    }
    
    _proto.getAmount = function(){
        if (!this.amount) return 0;
        return this.amount;
    }
    
    _proto.getUnits = function(){
        if (!this.unit || this.unit == 0) return 1;
        else return this.unit;
    }
    
    _proto.updateUnits = function(unit){
        this.unit = unit;
        this.cart.notifyChange(this);
    }
    
    _proto.updateAmount = function(amount, amountid){
        if (this.isSplit){
            this.breakup[amountid] = amount;
        } else {
            this.amount = amount;
        }
        this.cart.notifyChange(this);
    }
	
	_proto.getNotes = function(){
		if (!this.notes) return ""
		else return this.notes;
	}
}

donationcart.classes.DonationCart = jscLib.libFuncs.subclass(jscLib.system.extendedObject, "Donation Cart");
donationcart.classes.DonationCart.create = function(param){
    var _proto = this.prototype;
    
    _proto.init = function(param){
        this.cartItems = new Object();
        if (param.onChangeEvent){
            this.onChangeEvent = param.onChangeEvent;
        }
    }
    
    _proto.addCartItem = function(itemCode, item){
        this.cartItems[itemCode] = item;
        this.notifyChange(this, item);        
    }
    
    _proto.getCartTotal = function(){
        var result = 0;
        for(var item in this.cartItems){
            var obj = this.cartItems[item];
            result += obj.getItemTotal();
        }
        
        return result;
    }
    
    _proto.notifyChange = function(cartitem){
        if (this.onChangeEvent){
            this.onChangeEvent(this, cartitem);
        }
    }
    
    _proto.removeItem = function(itemcode){
        if (this.cartItems[itemcode]){
            delete(this.cartItems[itemcode]);
            this.notifyChange();
        }
    }
    
    _proto.clearCart = function(){
        for(var item in this.cartItems){
            var obj = this.cartItems[item];
            obj.updateAmount(0);
        }    
    }
    
    _proto.createCartItem = function(_itemcode, _issplit, _units, _amount, _causeCategory, _charityID, _causeText,
        _charityText, _minAmount, _notes){        
        if (parseFloat(_amount) > 0){
            var item = new donationcart.classes.CartItem({
                cart: this,
                itemcode: _itemcode,
                isSplit: (_issplit == 'True'),
                unit: _units,
                amount: _amount,
                causeCategory: _causeCategory,
                charityID: _charityID,
                causeText: _causeText,
                charityText: _charityText,
                minAmount: _minAmount,
				notes: _notes
            });
            this.addCartItem(_itemcode, item);
        };/* else {
            if (this.cartItems[_itemcode]){
                delete(this.cartItems[_itemcode]);
                this.notifyChange();
            }
        }*/
    }
    
    _proto.deserialize = function(){
        result = "";
        for(var item in this.cartItems){
            var obj = this.cartItems[item];
            var total = obj.getItemTotal();			
            if (total > 0){
                if (obj.isSplit){
                    result += obj.charityID;
                    result += "," + obj.getUnits();
                    for(var breakup in obj.breakup){
                        result += "," + breakup;
                        result += "," + obj.breakup[breakup];
                    }                
                } else {
                    result += obj.charityID;
                    result += "," + obj.getAmount();
                    result += "," + obj.getUnits();
                    result += "," + obj.causeCategory;
                }
				result = result + "," + obj.getNotes();
                result += "#";
            }
        }  
        return result;  
    }    
}

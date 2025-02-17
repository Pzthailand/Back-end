const Users = require('../Models/Users')

exports.PaymentQR = async(req,res) =>{
    try {
        //const amount = req.body.amount; // จำนวนเงินที่ต้องการ
        //const currency = 'thb'; // ค่าเงิน (เช่น THB สำหรับเงินบาท)

        const {username , amount } = req.body
       
        const parsedAmount = parseFloat(amount);
        //const parsedAmount = parseInt(amount, 10);
        if (isNaN(parsedAmount)) {
            return res.status(400).send("Amount must be a valid number.");
          }
        if(parsedAmount < 100){
            return res.status(400).send("Minimum amount 100 bath.");
        }
        
        //1.Top up amount => 100 bath
        //2.Send qrcode to front-end
        //3.API Check 3.1 Send status error or success

        //4.Save amount in Users DB - Method amount + Current wallet = wallet 
        const user = await Users.findOne({ username: username }).select('wallet');
                    const newWalletAmount = (user.wallet+parsedAmount);
                    if(user){
                        await Users.findOneAndUpdate(
                        { username: username }, // ค้นหาผู้ใช้ตาม username
                        { wallet: newWalletAmount }, // อัปเดต wallet
                        { new: true } // คืนค่าผู้ใช้ที่อัปเดตแล้ว
                        );
                    }
                    res.status(200).send('Add wallet Payment with QR Code Success');
    } catch (error) {
      res.status(500).send('Server Error')
    }
  };
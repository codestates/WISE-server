/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
import { Response } from 'express';
import axios from 'axios';
import OrderModel from '../models/order';

export const completePayment = async (req: any, res: Response) => {
  try {
    const { impUid } = req.body;

    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        imp_key: process.env.IMP_KEY,
        imp_secret: process.env.IMP_SECRET,
      },
    });
    const accessToken = getToken.data.response.access_token;

    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${impUid}`,
      method: 'get',
      headers: { Authorization: accessToken },
    });
    const paymentData = getPaymentData.data.response; // 조회한 결제 정보

    // DB에서 결제되어야 하는 금액 조회
    const { order } = req;
    // 결제 검증하기

    const { amount, status } = paymentData;

    if (amount === order.totalPayment) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
      await OrderModel.findByIdAndUpdate(order._id, { state: 'complete' }).exec(); // DB에 결제 정보 저장
      if (status === 'paid') {
        return res.status(200).json({ status: 'success', message: '일반 결제 성공' });
      }
    }

    // 결제 금액 불일치. 위/변조 된 결제
    return res.status(400).json({ status: 'failure', message: '결제 금액이 일치하지 않습니다' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' });
  }
};

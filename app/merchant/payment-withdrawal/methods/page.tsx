import AddMethod from '@/app/components/merchant/payment-method/add-method';
import { getPaymentMethodList } from '@/app/lib/api/merchant/payment-method';
import React from 'react'

const page = async () => {
  const res = await getPaymentMethodList()
  console.log(res);
  return (
     <AddMethod data={res?.data}/>
  )
}

export default page
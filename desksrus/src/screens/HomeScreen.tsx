import React from 'react'
import ControlledCarousel from '../components/ControlledCarousel';

interface Props {
  setAuth: (isAuthenticated: boolean) => void;
}

const HomeScreen = ({ setAuth }: Props) => {
  return (
    <div>
      <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqOYRunA0hukig3VnNb6FMLFTEpeVs_bQ3gg&usqp=CAU' style={{width: '100%'}}></img>
      <h4>The furniture store is a wonderful place to find high-quality pieces that will add beauty and functionality to your home. The staff is friendly and helpful, and they go above and beyond to ensure that their customers are satisfied with their purchases. Whether you're looking for a comfortable sofa for your living room, a stylish dining table for your kitchen, or a sturdy bed for your bedroom, you'll find everything you need at this furniture store. With a wide variety of styles and prices to choose from, you're sure to find something that fits your tastes and your budget. Plus, with their excellent customer service and commitment to offering the best products available, you can trust that you're making a wise investment when you shop at this furniture store.</h4>
      <button onClick={() => {
        setAuth(false);
        localStorage.removeItem('token');
        console.log("Logging out")
      }}>Logout</button>
    </div>
  )
}

export default HomeScreen
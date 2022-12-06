import React from 'react'
import ControlledCarousel from '../components/ControlledCarousel';

interface Props {
  setAuth: (isAuthenticated: boolean) => void;
}

const HomeScreen = ({ setAuth }: Props) => {
  return (
    <div>
      <ControlledCarousel />
      <button onClick={() => setAuth(false)}>Logout</button>
    </div>
  )
}

export default HomeScreen
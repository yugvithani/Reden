export const signup = async (userData) => {    
  try {
    const res = await fetch('http://localhost:3000/api/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!res.ok) {
      return res.status;
    }

    const data = await res.json();
    return data;
    
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
};

export const login = async (userData) => {
  try {
    const res = await fetch('http://localhost:3000/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const { token, user } = await res.json();
    // Save the token in localStorage
    localStorage.setItem('token', token);

    return {token, user};
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

  
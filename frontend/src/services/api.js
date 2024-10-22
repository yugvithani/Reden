export const signup = async (userData) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/signup`, {
      method: 'POST',
      body: userData, 
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
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/login`, {
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
    localStorage.setItem('userId', user._id);
    return { token, user };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

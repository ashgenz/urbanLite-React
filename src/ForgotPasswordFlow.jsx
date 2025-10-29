{isForgotPassView ? (
  <ForgotPasswordFlow 
    openCloseLogin={openCloseLogin} 
    setIsForgotPassView={setIsForgotPassView} 
  />
) : (
  // existing login form here
)}

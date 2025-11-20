# Writing Patterns to Avoid

Reference this doc to ensure clear, direct technical writing with proper information flow.

| Don't | Do |
|-------|-----|
| **Set the initial lamports balance** to N epochs (must be at least 2 epochs)<br/>• The account stays decompressed for at least these N epochs.<br/>• The amount can be customized based on the expected activity of the account.<br/>• The initial lamports balance is paid by the account creator. | **Set the initial lamports balance** to N epochs (must be at least 2 epochs)<br/>• Paid by the account creator.<br/>• Keeps the account decompressed for N epochs.<br/>• Customize N based on expected account activity. |

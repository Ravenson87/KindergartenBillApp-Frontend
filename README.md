# KindergartenBillApp 💻

KindergartenBillApp is a React + TypeScript application that provides a user-friendly interface for managing kindergarten bills. 
It allows administrators and staff to easily add new bills, search through records, and view insights into payments. 
The application integrates with the backend to trigger invoice generation and send invoices to users via email.

✨ Main features include:
- Adding and editing child accounts
- Recording monthly bills and payments
- Searching bills by child name, date, or category
- Viewing total payments per child and per month
- Responsive and intuitive design
- Triggering invoice generation and sending invoices to users via email

🛠️ Built with:
- React (Create React App with TypeScript)
- TypeScript for type safety and maintainability
- CSS for styling
- Git & GitHub for version control
- Integrated with Spring Boot backend

🚀 How to run the application:
```bash
cd KindergartenBillApp
npm install
npm start
```

📂 Project Structure

```
KindergartenBillApp/
├── public/                          # Static assets (index.html, favicon, manifest.json)
├── src/
│   ├── components/                  # Reusable UI components
│   ├── pages/                       # Application pages (ChildPage, BillPage, etc.)
│   ├── services/                    # API calls and integration with backend
│   ├── App.tsx                      # Main application entry point
│   └── index.tsx                    # React DOM rendering
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # Documentation
```

👤 Author

- Gavrić Siniša

- GitHub: github.com/Ravenson87
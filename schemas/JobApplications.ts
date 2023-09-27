ApplyForm: list({
    access:allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ validation: { isRequired: true, isEmail: true } }),
      message: text({ validation: { isRequired: true }, 
        ui: { displayMode: 'textarea' } }),
      createdAt: timestamp({ defaultValue: () => new Date().toISOString(), 
        ui: { isHidden: true } }),}
  }),
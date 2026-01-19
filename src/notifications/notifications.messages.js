export const notificationMessages = {
  productAdded: {
    variant: 'product-added',
    title: 'Producto cargado correctamente',
    body: 'Tu ítem ya se encuentra listo para sortear.',
  },
  productDeleted: {
    variant: 'product-deleted',
    title: 'Producto eliminado',
    body: ['Se eliminó el producto a sortear.', 'Volvé a cargar un ítem.'],
  },
  winnerNotified: {
    variant: 'winner-notified',
    title: 'Notificación enviada',
    body: 'Avisamos al ganador que venga a retirar su premio.',
  },
  genericError: {
    variant: 'genericError',
    title: 'Ocurrió un error.',
    body: [' Intentá nuevamente.'],
  },
}

// eslint-disable-next-line import/prefer-default-export
export const { format: formatPrice } = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const formatOfferMessage = offer => {
  return `${offer.name} | ${formatPrice(offer.price)} | ${offer.store.name} | ${
    offer.store.link
  }`;
};

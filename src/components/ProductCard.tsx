import {
  Button,
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

const ProductCard = ({
  productDetails,
  onAdd,
  onMinus,
}: {
  productDetails: {
    productName?: string;
    quantity?: number;
    price?: number;
  };
  onAdd: () => any;
  onMinus: () => any;
}) => {
  return (
    <Card style={{ margin: '1rem' }}>
      <CardContent>
        <Typography
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#FF8B13',
            textAlign: 'center',
          }}
        >
          {productDetails?.productName} - P{productDetails?.price}
        </Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Button style={{ fontSize: '30px' }} onClick={onMinus}>
            -
          </Button>
          <Typography style={{ fontSize: '20px', fontWeight: '600' }}>
            {productDetails?.quantity}
          </Typography>
          <Button style={{ fontSize: '30px' }} onClick={onAdd}>
            +
          </Button>
        </div>
        <Typography
          style={{
            fontSize: '12px',
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          TOTAL: P
          {Number(productDetails?.quantity) * Number(productDetails?.price)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

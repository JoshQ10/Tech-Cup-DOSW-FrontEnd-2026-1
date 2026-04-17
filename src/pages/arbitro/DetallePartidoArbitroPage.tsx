import { useParams } from 'react-router-dom';
import RolePagePlaceholder from '../../components/RolePagePlaceholder';

export default function DetallePartidoArbitroPage() {
  const { matchId } = useParams();
  return (
    <RolePagePlaceholder
      title="Detalle del Partido"
      subtitle={`Partido asignado: ${matchId || 'sin identificador'}`}
    />
  );
}


import Link from 'next/link';
import styles from '@/app/styles/page.module.css';

interface CenterCardProps {
    id: number;
    name: string;
    description?: string;
    isDepartment: boolean;
}

export default function CenterCard({ id, name, description, isDepartment }: CenterCardProps) {
    return (
        <Link
            href={isDepartment ? '/department' : `/centers/${id}`}
            className={`card ${styles.card}`}
        >
            <div className="card-body text-center">
                <h5 className="card-title">{name}</h5>
                {description && <p className="card-text">{description}</p>}
            </div>
        </Link>
    );
}

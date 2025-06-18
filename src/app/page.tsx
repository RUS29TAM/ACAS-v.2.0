import Link from 'next/link';
import styles from '../app/styles/page.module.css';
import prisma from '@/lib/prisma';

export default async function Home() {
    const centers = await prisma.center.findMany();

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-5">Клиентская база</h1>
            <div className="row">
                {centers.map((center) => (
                    <div key={center.id} className="col-md-4 mb-4">
                        <Link
                            href={center.isDepartment ? '/department' : `/centers/${center.id}`}
                            className={`card ${styles.card}`}
                        >
                            <div className="card-body text-center">
                                <h5 className="card-title">{center.name}</h5>
                                {center.description && <p className="card-text">{center.description}</p>}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

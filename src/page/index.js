/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const PagePage = () => {
    const router = useRouter();
    const { page } = router.query;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [data, setData] = useState();

    useEffect(() => {
        const getData = () => {
            fetch(`https://zlzew.mocklab.io/pagination?page=${page}`)
                .then(res => res.json())
                .then(data => {
                    setLoading(false);
                    setData(data);
                }).catch( e => {
                    setLoading(false);
                    setError(e);
                });
        }
        if (page) getData();
    }, [page]);

    if (loading) return <>...</>;
    if (error || !data) return <> Error! </>;

    const images = data && data.data;
    const limit = data && data.meta && data.meta.limit;
    const total = data && data.meta && data.meta.total;
    
    const handlePrev = () => router.push(`/page/${Number(page)-1}`);
    const handleGoTo = (p) => router.push(`/page/${p}`);
    const getPagination = () => {
        let pagination = [];
        for (let i = Number(page)-4; i <= Number(page)+4; i++ ) {
            if((i > 0) && (i <= (total/limit))) pagination.push(i);
        }
        let sliceInput;
        if (Number(page) <= 2) {
            sliceInput = [0, 5];
        } else if ((total/limit) - Number(page) <= 2 ) {
            sliceInput = [-5];
        } else {
            const iP = pagination.indexOf(Number(page));
            sliceInput = [iP-2, iP+3];
        }
        return pagination.slice(...sliceInput);
    }

    return (
        <div className="page">
            {images.map(({img_url}, i) => (
                <div key={i} className="image-container">
                    <img src={img_url} className="image" alt="" />
                    <h3>IMG {page}.{i+1}</h3>
                </div>
            ))}
            <div className="paginations">
                {page > 1 && (
                    <span
                        className="pagination"
                        onClick={handlePrev}
                    >
                        {'<'}
                    </span>
                )}
                {getPagination().map(p => (
                    <span
                        className={p == page? 'pagination active' : 'pagination'}
                        key={p}
                        onClick={() => handleGoTo(p)}
                    >
                        {p}
                    </span>
                ))}
                {page < total/limit && (
                    <span
                        className="pagination"
                        onClick={() => router.push(`/page/${Number(page)+1}`)}
                    >
                        {'>'}
                    </span>
                )}
            </div>
            <style jsx>{`
                .page {
                    text-align: center;
                }
                .image-container {
                    padding: 12px;
                    display: inline-block;
                }
                .paginations {
                    text-align: center;
                }
                .paginations :global(.pagination) {
                    padding: 6px;
                    cursor: pointer;
                    width: 34px;
                    height: 34px;
                    line-height: 20px;
                    display: inline-block;
                }
                .pagination.active {
                    background-color: #f03d6e;
                    border-radius: 99px;
                    color: #fff;
                }
            `}</style>
        </div>
    );
};

export default PagePage;
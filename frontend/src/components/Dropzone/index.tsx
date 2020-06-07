import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
    onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ( {onFileUploaded} ) => {
    const [selected_file_url, set_selected_file_url] = useState<string>('');
    
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        const fileUrl = URL.createObjectURL(file);
        set_selected_file_url(fileUrl);
        onFileUploaded(file);
    }, [onFileUploaded]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: 'image/*'
    });

    return (
        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} accept="image/*"/>
                {
                    selected_file_url ? 
                    <img src={selected_file_url} alt="Point thumbnail" /> : 
                    (
                        isDragActive ?
                        <p><FiUpload /> Solte a imagem aqui</p> :
                        <p><FiUpload /> Imagem do Estabelecimento</p>
                    )
                }
                
        </div>
    )
}

export default Dropzone;